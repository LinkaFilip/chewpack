import { NextResponse } from 'next/server'
import { isPlanId, plans } from '../../../plans'

export async function POST (request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Missing STRIPE_SECRET_KEY environment variable.' },
      { status: 500 }
    )
  }

  const payload = (await request.json().catch(() => ({}))) as {
    plan?: string
    customer?: {
      email?: string
      name?: string
      company?: string
      country?: string
    }
  }

  const planId = isPlanId(payload.plan) ? payload.plan : '1y'
  const plan = plans[planId]
  const customer = payload.customer ?? {}

  const body = new URLSearchParams()
  body.set('amount', plan.stripe.amount)
  body.set('currency', 'eur')
  body.set('automatic_payment_methods[enabled]', 'true')
  body.set('description', plan.stripe.description)
  body.set('metadata[plan_id]', planId)
  body.set('metadata[plan_title]', plan.title)
  if (customer.email) {
    body.set('receipt_email', customer.email)
  }

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  const stripePayload = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: stripePayload?.error?.message ?? 'Stripe intent creation failed.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    clientSecret: stripePayload.client_secret,
    paymentIntentId: stripePayload.id,
    planId,
    customer
  })
}
