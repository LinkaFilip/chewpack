'use client'

import { useState } from 'react'
import Link from 'next/link'
import { isPlanId, planOrder, plans } from '../plans'

export default function CheckoutClient ({
  planId: initialPlanId
}: {
  planId?: string
}) {
  const planId = isPlanId(initialPlanId) ? initialPlanId : '1y'
  const [selectedPlanId, setSelectedPlanId] = useState(planId)
  const plan = plans[selectedPlanId]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('CZ')

  async function createIntent () {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan: selectedPlanId,
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
      throw new Error(data?.error ?? 'Unable to prepare checkout.')
    }

    return data as { checkoutUrl: string }
  }

  async function handleCheckout () {
    try {
      setLoading(true)
      setError('')

      const session = await createIntent()
      window.location.href = session.checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete checkout.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#050814] px-6 py-10 text-white'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='text-sm text-white/55 hover:text-white'>
            Back to the main page
          </Link>
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
                const active = id === selectedPlanId
                return (
                  <button
                    key={id}
                    type='button'
                    onClick={() => setSelectedPlanId(id)}
                    className={`rounded-[1.5rem] border p-5 text-left transition ${
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
                    {active ? (
                      <span className='mt-4 inline-flex rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-black/70'>
                        Selected
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70'>
                <p className='text-sm opacity-70'>Billing</p>
                <p className='mt-2 text-lg font-semibold'>{plan.billing}</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70'>
                <p className='text-sm opacity-70'>Access cadence</p>
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
                  <select
                    value={country}
                    onChange={event => setCountry(event.target.value)}
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  >
                    <option value='CZ'>Czechia</option>
                    <option value='SK'>Slovakia</option>
                    <option value='DE'>Germany</option>
                    <option value='AT'>Austria</option>
                  </select>
                </label>
              </div>
              <p className='mt-4 text-sm leading-7 text-white/45'>
                Stripe Checkout collects payment details on Stripe&apos;s hosted payment page.
                Your app sends only customer details and the selected plan to Stripe.
              </p>
            </div>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className='rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Preparing checkout...' : 'Continue to secure checkout'}
              </button>
            </div>
            {error ? (
              <p className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
                {error}
              </p>
            ) : null}
          </div>

          <aside className='self-start rounded-[2rem] border border-white/10 bg-[#0b1020] p-6 md:sticky md:top-8'>
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

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/35'>
                Secure checkout
              </p>
              <ul className='mt-4 space-y-3 text-sm text-white/55'>
                <li>Payment handled securely by Stripe.</li>
                <li>Your license is generated after successful payment.</li>
                <li>No payment details are stored by this app.</li>
              </ul>
            </div>

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-sm leading-7 text-white/50'>
                Click &quot;Continue to secure checkout&quot; to create a Stripe Checkout Session and open Stripe&apos;s hosted payment page.
              </p>
            </div>

            <p className='mt-8 text-sm leading-7 text-white/50'>
              This flow uses Stripe Checkout. The browser redirects to Stripe&apos;s hosted payment page, then returns here on success or cancel.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}
