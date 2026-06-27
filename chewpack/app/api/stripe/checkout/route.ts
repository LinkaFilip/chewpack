import { NextResponse } from 'next/server'
import { isPlanId, plans } from '../../../plans'

function isRoughEmail (value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

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
  const customerEmail = customer.email?.trim()

  if (customerEmail && !isRoughEmail(customerEmail)) {
    return NextResponse.json(
      { error: 'Enter a valid customer email address.' },
      { status: 400 }
    )
  }

  const body = new URLSearchParams()
  body.set('mode', 'payment')
  body.set('success_url', `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
  body.set('cancel_url', `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/checkout/cancel`)
  body.set('line_items[0][quantity]', '1')
  body.set('line_items[0][price_data][currency]', 'eur')
  body.set('line_items[0][price_data][unit_amount]', plan.stripe.amount)
  body.set('line_items[0][price_data][product_data][name]', plan.title)
  body.set('line_items[0][price_data][product_data][description]', plan.stripe.description)
  body.set('metadata[plan_id]', planId)
  body.set('metadata[plan_title]', plan.title)
  if (customerEmail) body.set('customer_email', customerEmail)

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
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
      { error: stripePayload?.error?.message ?? 'Stripe checkout session creation failed.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    checkoutSessionId: stripePayload.id,
    checkoutUrl: stripePayload.url,
    planId
  })
}
