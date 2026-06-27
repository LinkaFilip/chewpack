import { NextResponse } from 'next/server'
import { isPlanId, plans } from '../../../plans'

export async function POST (request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
  body.set('mode', plan.mode)
  body.set('success_url', `${baseUrl}/checkout/success`)
  body.set('cancel_url', `${baseUrl}/checkout/cancel`)
  body.set('billing_address_collection', 'required')
  body.set('line_items[0][quantity]', '1')
  body.set('line_items[0][price_data][currency]', 'eur')
  body.set('line_items[0][price_data][unit_amount]', plan.stripe.amount)
  body.set('line_items[0][price_data][product_data][name]', plan.stripe.productName)
  body.set('line_items[0][price_data][product_data][description]', plan.stripe.description)
  if (plan.stripe.recurring) {
    body.set('line_items[0][price_data][recurring][interval]', plan.stripe.recurring.interval)
    body.set(
      'line_items[0][price_data][recurring][interval_count]',
      plan.stripe.recurring.interval_count
    )
  }
  body.set('metadata[plan_id]', planId)
  if (customer.email) body.set('customer_email', customer.email)
  if (customer.name) body.set('client_reference_id', customer.name)
  if (customer.company) body.set('metadata[company]', customer.company)
  if (customer.country) body.set('metadata[country]', customer.country)

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
      { error: stripePayload?.error?.message ?? 'Stripe checkout failed.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: stripePayload.url })
}
