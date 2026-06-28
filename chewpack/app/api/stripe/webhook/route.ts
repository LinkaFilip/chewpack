import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { finishStripeEvent, insertStripeEvent } from '../../../lib/licenses/db'
import {
  cancelSubscriptionLicense,
  issueLifetimeLicenseFromPaymentIntent,
  issueSubscriptionEntitlementFromInvoice
} from '../../../lib/licenses/service'

function parseStripeSignature (value: string) {
  const entries = value.split(',').map(part => part.trim())
  const timestamp = entries.find(part => part.startsWith('t='))?.slice(2)
  const signatures = entries
    .filter(part => part.startsWith('v1='))
    .map(part => part.slice(3))

  return { timestamp, signatures }
}

function normalizeWebhookSecret (value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

export async function POST (request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    ? normalizeWebhookSecret(process.env.STRIPE_WEBHOOK_SECRET)
    : undefined
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET environment variable.' },
      { status: 500 }
    )
  }

  const signatureHeader = request.headers.get('stripe-signature')
  if (!signatureHeader) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    )
  }

  const rawBody = await request.text()
  const { timestamp, signatures } = parseStripeSignature(signatureHeader)

  if (!timestamp || signatures.length === 0) {
    return NextResponse.json(
      { error: 'Malformed stripe-signature header.' },
      { status: 400 }
    )
  }

  const payload = `${timestamp}.${rawBody}`
  const expectedSignature = createHmac('sha256', webhookSecret)
    .update(payload, 'utf8')
    .digest('hex')

  const expected = Buffer.from(expectedSignature, 'hex')
  const verified = signatures.some(signature => {
    const candidate = Buffer.from(signature, 'hex')
    return candidate.length === expected.length && timingSafeEqual(candidate, expected)
  })

  if (!verified) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 })
  }

  const event = JSON.parse(rawBody) as {
    id?: string
    type?: string
    data?: {
      object?: {
        id?: string
        status?: string
        customer?: string
        subscription?: string
        customer_email?: string
        customer_email_address?: string
        receipt_email?: string
        lines?: unknown
        subscription_details?: unknown
        metadata?: Record<string, string>
      }
    }
  }

  if (event.id && event.type) {
    const shouldProcess = await insertStripeEvent(event.id, event.type)

    if (!shouldProcess) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    try {
      if (event.type === 'payment_intent.succeeded') {
        const result = await issueLifetimeLicenseFromPaymentIntent(event.data?.object ?? {})
        await finishStripeEvent(event.id, result.reason ?? 'lifetime_processed')
      } else if (event.type === 'invoice.paid') {
        const result = await issueSubscriptionEntitlementFromInvoice(event.data?.object as never ?? {})
        await finishStripeEvent(event.id, result.reason ?? 'invoice_processed')
      } else if (
        event.type === 'customer.subscription.deleted' ||
        event.type === 'invoice.payment_failed'
      ) {
        const object = event.data?.object
        const subscriptionId = event.type === 'customer.subscription.deleted'
          ? object?.id
          : object?.subscription

        if (subscriptionId) {
          await cancelSubscriptionLicense(subscriptionId)
        }

        await finishStripeEvent(event.id, 'subscription_access_stopped')
      } else {
        await finishStripeEvent(event.id, 'ignored')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown webhook error.'
      await finishStripeEvent(event.id, 'failed', message)
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
