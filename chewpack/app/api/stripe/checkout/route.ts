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
  const customerName = customer.name?.trim()
  const company = customer.company?.trim()
  const country = customer.country?.trim()

  if (customerEmail && !isRoughEmail(customerEmail)) {
    return NextResponse.json(
      { error: 'Enter a valid customer email address.' },
      { status: 400 }
    )
  }

  if (plan.stripe.mode === 'payment') {
    const body = new URLSearchParams()
    body.set('amount', plan.stripe.amount)
    body.set('currency', 'eur')
    body.set('description', plan.stripe.description)
    body.set('automatic_payment_methods[enabled]', 'true')
    body.set('metadata[plan_id]', planId)
    body.set('metadata[plan_title]', plan.title)
    if (customerEmail) body.set('receipt_email', customerEmail)
    if (customerName) body.set('metadata[customer_name]', customerName)
    if (company) body.set('metadata[company]', company)
    if (country) body.set('metadata[country]', country)

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
        { error: stripePayload?.error?.message ?? 'Stripe payment setup failed.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      clientSecret: stripePayload.client_secret,
      intentId: stripePayload.id,
      planId
    })
  }

  const customerBody = new URLSearchParams()
  if (customerEmail) customerBody.set('email', customerEmail)
  if (customerName) customerBody.set('name', customerName)
  if (company) customerBody.set('metadata[company]', company)
  if (country) customerBody.set('metadata[country]', country)

  const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: customerBody
  })

  const customerPayload = await customerResponse.json()

  if (!customerResponse.ok) {
    return NextResponse.json(
      { error: customerPayload?.error?.message ?? 'Stripe customer creation failed.' },
      { status: 500 }
    )
  }

  const productBody = new URLSearchParams()
  productBody.set('name', plan.stripe.productName)
  productBody.set('description', plan.stripe.description)
  productBody.set('metadata[plan_id]', planId)

  const productResponse = await fetch('https://api.stripe.com/v1/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: productBody
  })

  const productPayload = await productResponse.json()

  if (!productResponse.ok) {
    return NextResponse.json(
      { error: productPayload?.error?.message ?? 'Stripe product creation failed.' },
      { status: 500 }
    )
  }

  const body = new URLSearchParams()
  body.set('customer', customerPayload.id)
  body.set('items[0][quantity]', '1')
  body.set('items[0][price_data][currency]', 'eur')
  body.set('items[0][price_data][unit_amount]', plan.stripe.amount)
  body.set('items[0][price_data][product]', productPayload.id)
  body.set('items[0][price_data][recurring][interval]', plan.stripe.recurring?.interval ?? 'month')
  body.set('items[0][price_data][recurring][interval_count]', plan.stripe.recurring?.interval_count ?? '1')
  body.set('payment_behavior', 'default_incomplete')
  body.set('payment_settings[save_default_payment_method]', 'on_subscription')
  body.set('expand[0]', 'latest_invoice.payment_intent')
  body.set('metadata[plan_id]', planId)
  body.set('metadata[plan_title]', plan.title)
  if (company) body.set('metadata[company]', company)
  if (country) body.set('metadata[country]', country)

  const response = await fetch('https://api.stripe.com/v1/subscriptions', {
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
      { error: stripePayload?.error?.message ?? 'Stripe subscription setup failed.' },
      { status: 500 }
    )
  }

  const paymentIntent = stripePayload.latest_invoice?.payment_intent

  if (!paymentIntent?.client_secret) {
    return NextResponse.json(
      { error: 'Stripe did not return a payment intent for this subscription.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    intentId: paymentIntent.id,
    subscriptionId: stripePayload.id,
    planId
  })
}
