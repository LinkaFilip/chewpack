import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

function parseStripeSignature (value: string) {
  const entries = value.split(',').map(part => part.trim())
  const timestamp = entries.find(part => part.startsWith('t='))?.slice(2)
  const signatures = entries
    .filter(part => part.startsWith('v1='))
    .map(part => part.slice(3))

  return { timestamp, signatures }
}

export async function POST (request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
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
    type?: string
    data?: {
      object?: {
        id?: string
        payment_status?: string
        customer_email?: string
        metadata?: Record<string, string>
      }
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object
    console.log('Stripe checkout completed', {
      id: session?.id,
      payment_status: session?.payment_status,
      customer_email: session?.customer_email,
      metadata: session?.metadata
    })
  }

  return NextResponse.json({ received: true })
}
