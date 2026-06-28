'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { isPlanId, planOrder, plans, type PlanId } from '../plans'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null

type CustomerDetails = {
  email: string
  name: string
  company: string
  country: string
}

type PaymentSetup = {
  clientSecret: string
  planId: PlanId
}

function PaymentForm ({
  customer,
  disabled
}: {
  customer: CustomerDetails
  disabled: boolean
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handlePaymentSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stripe || !elements) return

    try {
      setSubmitting(true)
      setError('')

      const submitResult = await elements.submit()

      if (submitResult.error) {
        setError(submitResult.error.message ?? 'Payment details are incomplete.')
        return
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?`,
          payment_method_data: {
            billing_details: {
              email: customer.email || undefined,
              name: customer.name || undefined,
              address: {
                country: customer.country || undefined
              }
            }
          }
        }
      })

      if (result.error) {
        setError(result.error.message ?? 'Payment could not be completed.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handlePaymentSubmit} className='mt-6 space-y-5'>
      <div className='rounded-3xl border border-white/10 bg-white p-4 text-black'>
        <PaymentElement />
      </div>
      <button
        type='submit'
        disabled={disabled || submitting || !stripe || !elements}
        className='w-full rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {submitting ? 'Confirming payment...' : 'Pay securely'}
      </button>
      {error ? (
        <p className='rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
          {error}
        </p>
      ) : null}
    </form>
  )
}

export default function CheckoutClient ({
  planId: initialPlanId
}: {
  planId?: string
}) {
  const planId = isPlanId(initialPlanId) ? initialPlanId : '1y'
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(planId)
  const plan = plans[selectedPlanId]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('CZ')
  const [paymentSetup, setPaymentSetup] = useState<PaymentSetup | null>(null)

  const customer = useMemo<CustomerDetails>(() => ({
    email,
    name,
    company,
    country
  }), [company, country, email, name])

  async function createPaymentSetup () {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan: selectedPlanId,
        customer
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error ?? 'Unable to prepare payment.')
    }

    return data as PaymentSetup
  }

  async function handlePreparePayment () {
    try {
      setLoading(true)
      setError('')

      const setup = await createPaymentSetup()
      setPaymentSetup(setup)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to prepare payment.')
    } finally {
      setLoading(false)
    }
  }

  function selectPlan (id: PlanId) {
    setSelectedPlanId(id)
    setPaymentSetup(null)
    setError('')
  }

  return (
    <main className='min-h-screen bg-[#050814] px-6 py-10 text-white'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='text-sm text-white/55 hover:text-white'>
            Back to the main page
          </Link>
        </div>

        <section className='mt-10 grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/3 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12'>
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
                    onClick={() => selectPlan(id)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      active
                        ? 'border-white/30 bg-white text-black'
                        : 'border-white/10 bg-black/20 text-white hover:border-white/20 hover:bg-white/5'
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
              <div className='rounded-2xl border border-white/10 bg-white/4 p-5 text-white/70'>
                <p className='text-sm opacity-70'>Billing</p>
                <p className='mt-2 text-lg font-semibold'>{plan.billing}</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/4 p-5 text-white/70'>
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
                  Email <span className='text-white/35'>required</span>
                  <input
                    type='email'
                    value={email}
                    onChange={event => {
                      setEmail(event.target.value)
                      setPaymentSetup(null)
                    }}
                    placeholder='name@example.com'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Full name
                  <input
                    type='text'
                    value={name}
                    onChange={event => {
                      setName(event.target.value)
                      setPaymentSetup(null)
                    }}
                    placeholder='Jane Doe'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Company
                  <input
                    type='text'
                    value={company}
                    onChange={event => {
                      setCompany(event.target.value)
                      setPaymentSetup(null)
                    }}
                    placeholder='Optional'
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  />
                </label>
                <label className='grid gap-2 text-sm text-white/65'>
                  Country
                  <select
                    value={country}
                    onChange={event => {
                      setCountry(event.target.value)
                      setPaymentSetup(null)
                    }}
                    className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/30'
                  >
                    <option value='CZ' className='bg-[#0b1020] text-white'>Czechia</option>
                    <option value='SK' className='bg-[#0b1020] text-white'>Slovakia</option>
                    <option value='DE' className='bg-[#0b1020] text-white'>Germany</option>
                    <option value='AT' className='bg-[#0b1020] text-white'>Austria</option>
                  </select>
                </label>
              </div>
              <p className='mt-4 text-sm leading-7 text-white/45'>
                Payment details stay inside Stripe Elements. This app receives only the selected plan and customer details.
              </p>
            </div>

            <div className='mt-8'>
              {!paymentSetup ? (
              <button
                onClick={handlePreparePayment}
                disabled={loading || !stripePromise || !email.trim()}
                className='rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {!email.trim() ? (
                    <p className='mt-3 text-sm text-white/40'>
                      Enter your email first so we can deliver your license after payment.
                    </p>
                  ) : null}
                {loading ? 'Preparing secure payment...' : 'Enter payment details'}
              </button>
              ) : stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentSetup.clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        borderRadius: '14px'
                      }
                    }
                  }}
                >
                  <PaymentForm customer={customer} disabled={loading} />
                </Elements>
              ) : null}
            </div>
            {error ? (
              <p className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
                {error}
              </p>
            ) : null}
            {!stripePromise ? (
              <p className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
                Missing NEXT_PUBLIC_STRIPE_PUBLIC_KEY environment variable.
              </p>
            ) : null}
          </div>

          <aside className='self-start rounded-4xl border border-white/10 bg-[#0b1020] p-6 md:sticky md:top-8'>
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

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/3 p-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/35'>
                Secure payment
              </p>
              <ul className='mt-4 space-y-3 text-sm text-white/55'>
                <li>Card and wallet fields are rendered by Stripe Elements.</li>
                <li>Your license is generated after successful payment.</li>
                <li>No payment details are stored by this app.</li>
              </ul>
            </div>

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/3 p-4'>
              <p className='text-sm leading-7 text-white/50'>
                Click &quot;Enter payment details&quot; to create a Stripe payment setup, then complete payment directly on this page.
              </p>
            </div>

            <p className='mt-8 text-sm leading-7 text-white/50'>
              This flow uses Stripe Elements, so the browser stays on this checkout page while Stripe securely collects payment details.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}
