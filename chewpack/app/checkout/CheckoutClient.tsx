'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
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

const inputClass =
  'w-full rounded-md border border-[#ccd5de] bg-white px-3.5 py-3 text-[#101418] outline-none transition placeholder:text-[#9aa5b1] focus:border-[#101418] focus:ring-2 focus:ring-[#101418]/10'

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
      setError(
        err instanceof Error ? err.message : 'Payment could not be completed.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handlePaymentSubmit} className='mt-5 space-y-4'>
      <div className='rounded-lg border border-[#d8dde3] bg-white p-3 shadow-sm'>
        <PaymentElement />
      </div>
      <button
        type='submit'
        disabled={disabled || submitting || !stripe || !elements}
        className='w-full rounded-md bg-[#101418] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#26313a] disabled:cursor-not-allowed disabled:opacity-55'
      >
        {submitting ? 'Confirming payment...' : 'Pay securely'}
      </button>
      {error ? (
        <p className='rounded-md border border-[#f0b4b4] bg-[#fff1f1] p-3 text-sm text-[#9d1c1c]'>
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

  const customer = useMemo<CustomerDetails>(
    () => ({
      email,
      name,
      company,
      country
    }),
    [company, country, email, name]
  )

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

  function clearPaymentSetup () {
    setPaymentSetup(null)
  }

  return (
    <main className='min-h-screen bg-[#f4f6f8] px-4 py-5 text-[#101418] sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='flex flex-col gap-4 border-b border-[#d8dde3] pb-5 sm:flex-row sm:items-center sm:justify-between'>
          <Link href='/' className='inline-flex items-center gap-3'>
            <span className='grid h-10 w-10 place-items-center rounded-lg bg-[#101418] text-sm font-semibold text-white'>
              CP
            </span>
            <span>
              <span className='block text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>
                Chewpack
              </span>
              <span className='block text-sm text-[#5f6b77]'>
                Secure checkout
              </span>
            </span>
          </Link>
          <Link
            href='/'
            className='rounded-md border border-[#c6ced7] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#101418] transition hover:border-[#101418]'
          >
            Back to homepage
          </Link>
        </header>

        <section className='grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start'>
          <div className='space-y-6'>
            <div className='rounded-xl border border-[#d8dde3] bg-white p-5 shadow-sm sm:p-7'>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#18a0a6]'>
                {plan.highlight}
              </p>
              <div className='mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                  <h1 className='text-4xl font-semibold tracking-normal sm:text-5xl'>
                    Choose your Chewpack license
                  </h1>
                  <p className='mt-4 max-w-2xl text-base leading-7 text-[#5f6b77] sm:text-lg'>
                    {plan.subtitle}
                  </p>
                </div>
                <div className='rounded-lg border border-[#dce2e8] bg-[#f7f9fb] px-4 py-3'>
                  <p className='text-sm text-[#6a7580]'>Selected plan</p>
                  <p className='text-2xl font-semibold'>{plan.price}</p>
                </div>
              </div>
            </div>

            <div className='grid gap-3 md:grid-cols-3'>
              {planOrder.map(id => {
                const option = plans[id]
                const active = id === selectedPlanId
                return (
                  <button
                    key={id}
                    type='button'
                    onClick={() => selectPlan(id)}
                    className={`rounded-lg border p-5 text-left transition ${
                      active
                        ? 'border-[#101418] bg-[#101418] text-white shadow-[0_18px_45px_rgba(16,20,24,0.18)]'
                        : 'border-[#d8dde3] bg-white text-[#101418] hover:border-[#101418]'
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        active ? 'text-[#7de1e4]' : 'text-[#18a0a6]'
                      }`}
                    >
                      {option.highlight}
                    </span>
                    <span className='mt-3 block text-lg font-semibold'>
                      {option.title}
                    </span>
                    <span
                      className={`mt-2 block text-sm ${
                        active ? 'text-white/72' : 'text-[#5f6b77]'
                      }`}
                    >
                      {option.price} · {option.billing}
                    </span>
                    <span
                      className={`mt-4 block border-t pt-4 text-sm ${
                        active
                          ? 'border-white/15 text-white/72'
                          : 'border-[#e1e5ea] text-[#5f6b77]'
                      }`}
                    >
                      {option.cadence}
                    </span>
                  </button>
                )
              })}
            </div>

            <section className='rounded-xl border border-[#d8dde3] bg-white p-5 shadow-sm sm:p-7'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#18a0a6]'>
                    Customer details
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold'>
                    License delivery
                  </h2>
                </div>
                <p className='text-sm text-[#6a7580]'>
                  Payment fields are handled by Stripe.
                </p>
              </div>

              <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                <label className='grid gap-2 text-sm font-medium text-[#3a444e]'>
                  Email <span className='font-normal text-[#7b8794]'>required</span>
                  <input
                    type='email'
                    value={email}
                    onChange={event => {
                      setEmail(event.target.value)
                      clearPaymentSetup()
                    }}
                    placeholder='name@example.com'
                    className={inputClass}
                  />
                </label>
                <label className='grid gap-2 text-sm font-medium text-[#3a444e]'>
                  Full name
                  <input
                    type='text'
                    value={name}
                    onChange={event => {
                      setName(event.target.value)
                      clearPaymentSetup()
                    }}
                    placeholder='Jane Doe'
                    className={inputClass}
                  />
                </label>
                <label className='grid gap-2 text-sm font-medium text-[#3a444e]'>
                  Company
                  <input
                    type='text'
                    value={company}
                    onChange={event => {
                      setCompany(event.target.value)
                      clearPaymentSetup()
                    }}
                    placeholder='Optional'
                    className={inputClass}
                  />
                </label>
                <label className='grid gap-2 text-sm font-medium text-[#3a444e]'>
                  Country
                  <select
                    value={country}
                    onChange={event => {
                      setCountry(event.target.value)
                      clearPaymentSetup()
                    }}
                    className={inputClass}
                  >
                    <option value='CZ'>Czechia</option>
                    <option value='SK'>Slovakia</option>
                    <option value='DE'>Germany</option>
                    <option value='AT'>Austria</option>
                  </select>
                </label>
              </div>
            </section>

            <section className='rounded-xl border border-[#d8dde3] bg-white p-5 shadow-sm sm:p-7'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#18a0a6]'>
                    Payment
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold'>
                    Secure card details
                  </h2>
                </div>
                <span className='rounded-md bg-[#e8f7f7] px-3 py-1.5 text-sm font-semibold text-[#126a70]'>
                  Stripe Elements
                </span>
              </div>

              {!paymentSetup ? (
                <div className='mt-5'>
                  <button
                    type='button'
                    onClick={handlePreparePayment}
                    disabled={loading || !stripePromise || !email.trim()}
                    className='w-full rounded-md bg-[#101418] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#26313a] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto'
                  >
                    {loading ? 'Preparing secure payment...' : 'Enter payment details'}
                  </button>
                  {!email.trim() ? (
                    <p className='mt-3 text-sm leading-6 text-[#6a7580]'>
                      Enter your email first so the license can be delivered
                      after payment.
                    </p>
                  ) : null}
                </div>
              ) : stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentSetup.clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        borderRadius: '8px',
                        colorPrimary: '#101418',
                        colorText: '#101418',
                        colorTextSecondary: '#5f6b77',
                        colorBackground: '#ffffff'
                      }
                    }
                  }}
                >
                  <PaymentForm customer={customer} disabled={loading} />
                </Elements>
              ) : null}

              {error ? (
                <p className='mt-5 rounded-md border border-[#f0b4b4] bg-[#fff1f1] p-3 text-sm text-[#9d1c1c]'>
                  {error}
                </p>
              ) : null}
              {!stripePromise ? (
                <p className='mt-5 rounded-md border border-[#f0b4b4] bg-[#fff1f1] p-3 text-sm text-[#9d1c1c]'>
                  Missing NEXT_PUBLIC_STRIPE_PUBLIC_KEY environment variable.
                </p>
              ) : null}
            </section>
          </div>

          <aside className='rounded-xl border border-[#d8dde3] bg-white p-5 shadow-sm lg:sticky lg:top-6'>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#18a0a6]'>
              Order summary
            </p>
            <div className='mt-5 space-y-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='font-semibold'>{plan.title}</p>
                  <p className='mt-1 text-sm text-[#6a7580]'>{plan.billing}</p>
                </div>
                <p className='font-semibold'>{plan.price}</p>
              </div>
              <div className='rounded-lg border border-[#dce2e8] bg-[#f7f9fb] p-4'>
                <p className='text-sm font-medium text-[#3a444e]'>
                  Included with this license
                </p>
                <ul className='mt-3 space-y-2 text-sm text-[#5f6b77]'>
                  {plan.features.map(feature => (
                    <li key={feature} className='flex gap-2'>
                      <span className='mt-2 h-1.5 w-1.5 rounded-full bg-[#18a0a6]' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='border-t border-[#e1e5ea] pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold'>Total today</span>
                  <span className='text-2xl font-semibold'>{plan.price}</span>
                </div>
                <p className='mt-2 text-sm leading-6 text-[#6a7580]'>
                  Fulfillment happens after the Stripe webhook confirms payment.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
