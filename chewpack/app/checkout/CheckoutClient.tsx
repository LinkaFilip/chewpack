'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { isPlanId, planOrder, plans } from '../plans'

export default function CheckoutClient ({
  planId: initialPlanId
}: {
  planId?: string
}) {
  const planId = isPlanId(initialPlanId) ? initialPlanId : '1y'
  const plan = plans[planId]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('CZ')

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
        body: JSON.stringify({
          plan: planId,
          customer: {
            email,
            name,
            company,
            country
          }
        })
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

            <div className='mt-8 grid gap-3 md:grid-cols-3'>
              {planOrder.map(id => {
                const option = plans[id]
                const active = id === planId
                return (
                  <Link
                    key={id}
                    href={`/checkout?plan=${id}`}
                    className={`rounded-[1.5rem] border p-5 transition ${
                      active
                        ? 'border-white/30 bg-white text-black'
                        : 'border-white/10 bg-black/20 text-white hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.28em] ${
                        active ? 'text-black/55' : 'text-white/35'
                      }`}
                    >
                      {option.highlight}
                    </p>
                    <p className='mt-3 text-lg font-semibold'>{option.title}</p>
                    <p
                      className={`mt-2 text-sm ${
                        active ? 'text-black/65' : 'text-white/55'
                      }`}
                    >
                      {option.price}
                    </p>
                  </Link>
                )
              })}
            </div>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-white/10 bg-black/20 p-5'>
                <p className='text-sm text-white/45'>Billing</p>
                <p className='mt-2 text-lg font-semibold'>{plan.billing}</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-black/20 p-5'>
                <p className='text-sm text-white/45'>Access cadence</p>
                <p className='mt-2 text-lg font-semibold'>{plan.cadence}</p>
              </div>
            </div>

            <div className='mt-8 rounded-[1.75rem] border border-white/10 bg-black/20 p-6'>
              <p className='text-sm uppercase tracking-[0.28em] text-white/35'>
                Customer details
              </p>
              <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                <label className='grid gap-2 text-sm text-white/65'>
                  Email
                  <input
                    type='email'
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder='name@example.com'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Full name
                  <input
                    type='text'
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder='Jane Doe'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Company
                  <input
                    type='text'
                    value={company}
                    onChange={event => setCompany(event.target.value)}
                    placeholder='Optional'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Country
                  <input
                    type='text'
                    value={country}
                    onChange={event => setCountry(event.target.value.toUpperCase())}
                    placeholder='CZ'
                    maxLength={2}
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
              </div>
              <p className='mt-4 text-sm leading-7 text-white/45'>
                Payment details are collected by Stripe on the hosted checkout
                page. This app only forwards customer info and redirect URLs.
              </p>
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              {['Card payment', 'Bank debit via Stripe', 'Wallets'].map(item => (
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
              <button
                type='button'
                onClick={() => {
                  setEmail('')
                  setName('')
                  setCompany('')
                  setCountry('CZ')
                }}
                className='rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10'
              >
                Clear details
              </button>
            </div>
            <div className='mt-4'>
              <Link
                href='/'
                className='inline-flex rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10'
              >
                Back to product
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
              <div className='flex items-center justify-between'>
                <span>Billing</span>
                <span>{plan.billing}</span>
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
