'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { isPlanId, planOrder, plans } from '../plans'

declare global {
  interface Window {
    Stripe?: any
  }
}

type PaymentTone = 'calm' | 'active' | 'bright'

const methodOptions = [
  {
    id: 'card',
    title: 'Card',
    subtitle: 'Fast checkout for most customers.',
    tone: 'bright' as PaymentTone
  },
  {
    id: 'bank',
    title: 'Bank debit',
    subtitle: 'Direct debit when the customer wants it.',
    tone: 'active' as PaymentTone
  },
  {
    id: 'wallet',
    title: 'Wallet',
    subtitle: 'Apple Pay / Google Pay when available.',
    tone: 'calm' as PaymentTone
  }
]

const toneClass: Record<PaymentTone, string> = {
  calm: 'border-white/10 bg-white/[0.04] text-white/70',
  active: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100',
  bright: 'border-white/30 bg-white text-black'
}

let stripeScriptPromise: Promise<void> | null = null

function loadStripeScript () {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Stripe) return Promise.resolve()
  if (!stripeScriptPromise) {
    stripeScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-stripe-js]'
      )
      if (existing) {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () =>
          reject(new Error('Failed to load Stripe.js'))
        )
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.async = true
      script.dataset.stripeJs = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Stripe.js'))
      document.head.appendChild(script)
    })
  }
  return stripeScriptPromise
}

export default function CheckoutClient ({
  planId: initialPlanId
}: {
  planId?: string
}) {
  const planId = isPlanId(initialPlanId) ? initialPlanId : '1y'
  const [selectedPlanId, setSelectedPlanId] = useState(planId)
  const plan = plans[selectedPlanId]
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('CZ')
  const [method, setMethod] = useState<'card' | 'bank' | 'wallet'>('card')
  const [clientSecret, setClientSecret] = useState('')
  const [isReady, setIsReady] = useState(false)
  const paymentElementRef = useRef<HTMLDivElement | null>(null)
  const stripeRef = useRef<any>(null)
  const elementsRef = useRef<any>(null)
  const paymentElementInstanceRef = useRef<any>(null)

  const checkoutLabel = useMemo(() => {
    if (selectedPlanId === 'lifetime') return 'Unlock lifetime access'
    if (selectedPlanId === '3m') return 'Start 3-month access'
    return 'Start 1-year access'
  }, [selectedPlanId])

  const currentTone = methodOptions.find(option => option.id === method)?.tone ?? 'calm'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!clientSecret || !mounted) return

    let cancelled = false

    async function mountPaymentElement () {
      try {
        await loadStripeScript()
        if (cancelled || !window.Stripe) return

        const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
        if (!publicKey) {
          throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLIC_KEY environment variable.')
        }

        const stripe = window.Stripe(publicKey)
        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#ffffff',
              colorBackground: '#0b1020',
              colorText: '#ffffff',
              colorTextSecondary: 'rgba(255,255,255,0.6)',
              colorDanger: '#fca5a5',
              borderRadius: '14px'
            }
          }
        })

        const paymentElement = elements.create('payment', {
          layout: 'tabs'
        })

        paymentElement.mount(paymentElementRef.current!)
        stripeRef.current = stripe
        elementsRef.current = elements
        paymentElementInstanceRef.current = paymentElement
        setIsReady(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize checkout.')
      }
    }

    mountPaymentElement()

    return () => {
      cancelled = true
      setIsReady(false)
      paymentElementInstanceRef.current?.destroy?.()
      paymentElementInstanceRef.current = null
      elementsRef.current = null
      stripeRef.current = null
    }
  }, [clientSecret, mounted])

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

    return data.clientSecret as string
  }

  async function handleCheckout () {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (!clientSecret) {
        const nextClientSecret = await createIntent()
        setClientSecret(nextClientSecret)
        return
      }

      if (!stripeRef.current || !elementsRef.current) {
        throw new Error('Checkout is still loading.')
      }

      const { error: submitError } = await elementsRef.current.submit()
      if (submitError) {
        throw new Error(submitError.message ?? 'Please check your payment details.')
      }

      const result = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`
        },
        redirect: 'if_required'
      })

      if (result.error) {
        throw new Error(result.error.message ?? 'Payment failed.')
      }

      setSuccess('Payment completed. Access is being unlocked.')
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
            Back to root
          </Link>
          <span className='rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/40'>
            Embedded Stripe checkout
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
                  </button>
                )
              })}
            </div>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className={`rounded-2xl border p-5 ${toneClass[currentTone]}`}>
                <p className='text-sm opacity-70'>Billing</p>
                <p className='mt-2 text-lg font-semibold'>{plan.billing}</p>
              </div>
              <div className={`rounded-2xl border p-5 ${toneClass[currentTone]}`}>
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
                Payment entry stays embedded in this page through Stripe.js.
                Your app only sends customer details and the selected plan to Stripe.
              </p>
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              {methodOptions.map(item => {
                const active = method === item.id
                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => setMethod(item.id as typeof method)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? 'border-white/30 bg-white text-black'
                        : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.07]'
                    }`}
                  >
                    <span className='block font-semibold'>{item.title}</span>
                    <span className={`mt-1 block ${active ? 'text-black/65' : 'text-white/50'}`}>
                      {item.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className='rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading
                  ? clientSecret
                    ? 'Confirming payment...'
                    : 'Preparing checkout...'
                  : clientSecret
                    ? checkoutLabel
                    : 'Load checkout'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setClientSecret('')
                  setSuccess('')
                  setError('')
                }}
                className='rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10'
              >
                Reset checkout
              </button>
            </div>

            {success ? (
              <p className='mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100'>
                {success}
              </p>
            ) : null}
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

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/35'>
                Live checkout state
              </p>
              <div className='mt-3 grid gap-3'>
                <div className={`rounded-2xl border px-4 py-3 text-sm ${mounted ? 'border-white/20 bg-white/[0.07]' : 'border-white/10 bg-white/[0.03]'}`}>
                  Client secret {clientSecret ? 'ready' : 'not created yet'}
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-sm ${isReady ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/[0.03] text-white/70'}`}>
                  Payment element {isReady ? 'mounted' : 'waiting'}
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-sm ${method === 'card' ? toneClass.bright : method === 'bank' ? toneClass.active : toneClass.calm}`}>
                  Selected method: {method}
                </div>
              </div>
            </div>

            <div className='mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4'>
              <div className='min-h-[260px]' ref={paymentElementRef} />
              {!clientSecret ? (
                <p className='mt-4 text-sm leading-7 text-white/50'>
                  Click "Load checkout" to create the PaymentIntent and render Stripe&apos;s embedded payment fields here.
                </p>
              ) : null}
            </div>

            <p className='mt-8 text-sm leading-7 text-white/50'>
              This flow uses an embedded Stripe payment component. The page does not redirect unless the selected payment method requires it.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}
