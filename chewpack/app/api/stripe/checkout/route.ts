import { NextResponse } from 'next/server'

type PlanId = '3m' | '1y' | 'lifetime'

const plans: Record<
  PlanId,
  {
    mode: 'subscription' | 'payment'
    amount: string
    name: string
    description: string
    recurring?: {
      interval: 'month'
      interval_count: string
    }
  }
> = {
  '3m': {
    mode: 'subscription',
    amount: '2000',
    name: '3-month license',
    description: 'Chewpack license for 3 months',
    recurring: {
      interval: 'month',
      interval_count: '3'
    }
  },
  '1y': {
    mode: 'subscription',
    amount: '6000',
    name: '1-year license',
    description: 'Chewpack license for 1 year',
    recurring: {
      interval: 'month',
      interval_count: '12'
    }
  },
  lifetime: {
    mode: 'payment',
    amount: '14900',
    name: 'Lifetime license',
    description: 'Chewpack lifetime license'
  }
}

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
    plan?: PlanId
  }
  const planId = payload.plan && payload.plan in plans ? payload.plan : '1y'
  const plan = plans[planId]

  const body = new URLSearchParams()
  body.set('mode', plan.mode)
  body.set('success_url', `${baseUrl}/checkout/success`)
  body.set('cancel_url', `${baseUrl}/checkout/cancel`)
  body.set('line_items[0][quantity]', '1')
  body.set('line_items[0][price_data][currency]', 'eur')
  body.set('line_items[0][price_data][unit_amount]', plan.amount)
  body.set('line_items[0][price_data][product_data][name]', plan.name)
  body.set('line_items[0][price_data][product_data][description]', plan.description)
  if (plan.recurring) {
    body.set('line_items[0][price_data][recurring][interval]', plan.recurring.interval)
    body.set(
      'line_items[0][price_data][recurring][interval_count]',
      plan.recurring.interval_count
    )
  }
  body.set('metadata[plan_id]', planId)

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
