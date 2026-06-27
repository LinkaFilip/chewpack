'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type PlanId = '3m' | '1y' | 'lifetime'

const plans: Record<
  PlanId,
  {
    title: string
    price: string
    billing: string
    subtitle: string
    highlight: string
  }
> = {
  '3m': {
    title: '3-month license',
    price: '20 EUR',
    billing: 'Billed once',
    subtitle: 'A compact option for one project or a short evaluation cycle.',
    highlight: 'Short commitment'
  },
  '1y': {
    title: '1-year license',
    price: '60 EUR',
    billing: 'Billed once',
    subtitle: 'The strongest value for ongoing work and repeat clients.',
    highlight: 'Best value'
  },
  lifetime: {
    title: 'Lifetime license',
    price: '149 EUR',
    billing: 'Billed once',
    subtitle: 'Buy once and keep the workflow without renewal pressure.',
    highlight: 'Own it'
  }
}

export default function CheckoutClient ({
  planId: initialPlanId
}: {
  planId?: string
}) {
  const planId = (initialPlanId === '3m' || initialPlanId === '1y' || initialPlanId === 'lifetime'
    ? initialPlanId
    : '1y') as PlanId
  const plan = plans[planId]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkoutLabel = useMemo(() => {
    if (planId === 'lifetime') return 'Buy lifetime access'
    if (planId === '3m') return 'Pay for 3 months'
    return 'Pay for 1 year'
  }, [planId])

  async function handleCheckout () {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: planId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to start checkout.')
      }

      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout.')
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#050814] px-6 py-10 text-white'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='text-sm text-white/55 hover:text-white'>
            Back to root
          </Link>
          <span className='rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/40'>
            Stripe checkout
          </span>
        </div>

        <section className='mt-10 grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12'>
          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
              {plan.highlight}
            </p>
            <h1 className='mt-4 text-4xl font-semibold tracking-tight md:text-6xl'>
              {plan.title}
            </h1>
            <p className='mt-5 max-w-2xl text-lg leading-8 text-white/65'>
              {plan.subtitle}
            </p>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-white/10 bg-black/20 p-5'>
                <p className='text-sm text-white/45'>Plan selected</p>
                <p className='mt-2 font-mono text-sm text-white/80'>{planId}</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-black/20 p-5'>
                <p className='text-sm text-white/45'>Billing</p>
                <p className='mt-2 text-lg font-semibold'>{plan.billing}</p>
              </div>
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              {['Card payment', 'Apple Pay', 'Google Pay'].map(item => (
                <div
                  key={item}
                  className='rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75'
                >
                  {item}
                </div>
              ))}
            </div>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className='rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Opening Stripe...' : checkoutLabel}
              </button>
              <Link
                href='/#pricing'
                className='rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10'
              >
                Compare plans
              </Link>
            </div>

            {error ? (
              <p className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
                {error}
              </p>
            ) : null}
          </div>

          <aside className='rounded-[2rem] border border-white/10 bg-[#0b1020] p-6'>
            <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
              Summary
            </p>
            <div className='mt-6 space-y-4 text-white/75'>
              <div className='flex items-center justify-between'>
                <span>{plan.title}</span>
                <span>{plan.price}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Access type</span>
                <span>{plan.highlight}</span>
              </div>
              <div className='flex items-center justify-between border-t border-white/10 pt-4 text-white'>
                <span className='font-semibold'>Total today</span>
                <span className='text-xl font-semibold'>{plan.price}</span>
              </div>
            </div>
            <div className='mt-8 grid gap-3'>
              {[
                'Secure Stripe-hosted payment',
                'No card details stored here',
                'Instant success and cancel redirects'
              ].map(item => (
                <div
                  key={item}
                  className='rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70'
                >
                  {item}
                </div>
              ))}
            </div>
            <p className='mt-8 text-sm leading-7 text-white/50'>
              Success redirects to `/checkout/success` and error redirects to
              `/checkout/cancel`.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}
