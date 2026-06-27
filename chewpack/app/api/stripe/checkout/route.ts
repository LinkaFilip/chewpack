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

  const priceId = plan.stripe.priceEnv ? process.env[plan.stripe.priceEnv] : undefined
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${plan.stripe.priceEnv} environment variable.` },
      { status: 500 }
    )
  }

  const body = new URLSearchParams()
  body.set('customer', customerPayload.id)
  body.set('items[0][price]', priceId)
  body.set('items[0][quantity]', '1')
  body.set('payment_behavior', 'default_incomplete')
  body.set('payment_settings[save_default_payment_method]', 'on_subscription')
  body.set('expand[0]', 'latest_invoice.confirmation_secret')
  body.set('expand[1]', 'latest_invoice.payment_intent')
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

  const latestInvoice = stripePayload.latest_invoice
  const paymentIntent = latestInvoice?.payment_intent
  const clientSecret = latestInvoice?.confirmation_secret?.client_secret ?? paymentIntent?.client_secret
  const intentId = paymentIntent?.id ?? latestInvoice?.id

  if (!clientSecret) {
    return NextResponse.json(
      { error: 'Stripe did not return a payment secret for this subscription.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    clientSecret,
    intentId,
    subscriptionId: stripePayload.id,
    planId
  })
}
