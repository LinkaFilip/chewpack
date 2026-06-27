import Link from 'next/link'
import { SeoSchema } from './SeoSchema'

const pricingPlans = [
  {
    name: '3 months',
    price: '20 EUR',
    cadence: 'trial-friendly access',
    description:
      'Best for trying Chewpack on a real project before committing longer term.',
    href: '/checkout?plan=3m',
    badge: 'Starter',
    accent: 'from-white to-white/70',
    features: ['Immediate access', 'All editor tools', 'Stripe checkout']
  },
  {
    name: '1 year',
    price: '60 EUR',
    cadence: 'billed once for a full year',
    description:
      'Best value for active type designers who want uninterrupted work across multiple projects.',
    href: '/checkout?plan=1y',
    badge: 'Best value',
    accent: 'from-[#8df7c8] to-[#49c58d]',
    features: ['Lower monthly cost', 'Priority support', 'Most popular choice']
  },
  {
    name: 'Lifetime',
    price: '149 EUR',
    cadence: 'single purchase, no renewal',
    description:
      'Best for studios and long-term users who want to buy once and keep the tool in rotation.',
    href: '/checkout?plan=lifetime',
    badge: 'Own it',
    accent: 'from-[#f6c66b] to-[#ff9f43]',
    features: ['No renewal', 'Permanent license', 'Studio-friendly']
  }
]

const features = [
  {
    title: 'Draw real letterforms',
    text: 'Create glyphs with clean curves, editable nodes and precise handles instead of fighting with generic vector tools.'
  },
  {
    title: 'Control spacing and metrics',
    text: 'Adjust width, side bearings and spacing while testing your typeface in real words.'
  },
  {
    title: 'Build a complete typeface',
    text: 'Move from single letters to a usable font system with glyph previews, editing tabs and project saving.'
  },
  {
    title: 'Export polished demos',
    text: 'Create smooth screen-recording style videos with a generated cursor, perfect for portfolios and client presentations.'
  }
]

export default function Home () {
  return (
    <>
      <SeoSchema />
      <main className='min-h-screen bg-[#050814] text-white'>
        <div className='mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10'>
          <header className='flex items-center justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/40'>
                Chewpack
              </p>
              <h1 className='mt-2 text-2xl font-semibold tracking-tight'>
                Font editing software for people who want control.
              </h1>
            </div>
            <Link
              href='/checkout?plan=1y'
              className='rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black'
            >
              Subscribe
            </Link>
          </header>

          <section className='grid flex-1 items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr]'>
            <div>
              <p className='inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70'>
                Choose your license
              </p>
              <h2 className='mt-6 max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl'>
                Make your own font.
                <span className='block text-white/45'>Keep it sharp.</span>
              </h2>
              <p className='mt-6 max-w-xl text-lg leading-8 text-white/65'>
                Chewpack is a focused font editor for drawing glyphs, refining
                outlines, checking spacing, and shipping a typeface that feels
                intentional.
              </p>
              <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='/checkout?plan=1y'
                  className='rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-black transition hover:bg-white/85'
                >
                  See 1-year pricing
                </Link>
                <a
                  href='#pricing'
                  className='rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10'
                >
                  Compare plans
                </a>
              </div>
              <div className='mt-8 flex flex-wrap gap-3 text-sm text-white/45'>
                <span>Glyph editing</span>
                <span>•</span>
                <span>Metrics</span>
                <span>•</span>
                <span>Spacing</span>
                <span>•</span>
                <span>Demo export</span>
              </div>
            </div>

            <div className='relative'>
              <div className='absolute -inset-8 rounded-[3rem] bg-white/10 blur-2xl' />
              <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020] shadow-2xl'>
                <div className='flex items-center gap-2 border-b border-white/10 px-5 py-4'>
                  <span className='h-3 w-3 rounded-full bg-white/25' />
                  <span className='h-3 w-3 rounded-full bg-white/15' />
                  <span className='h-3 w-3 rounded-full bg-white/10' />
                  <span className='ml-4 text-xs text-white/40'>
                    Chewpack - Glyph Editor
                  </span>
                </div>
                <div className='grid min-h-[440px] grid-cols-[90px_1fr]'>
                  <aside className='border-r border-white/10 bg-white/[0.02] p-4'>
                    <div className='mb-4 h-8 rounded-lg bg-white/10' />
                    <div className='grid grid-cols-2 gap-2'>
                      {'ABCDEGPRS'.split('').map(letter => (
                        <div
                          key={letter}
                          className='flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm text-white/50'
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </aside>
                  <div className='relative p-8'>
                    <div className='mb-6 flex items-center justify-between'>
                      <div>
                        <p className='text-sm text-white/40'>Editing glyph</p>
                        <p className='text-2xl font-semibold'>G</p>
                      </div>
                      <div className='rounded-full bg-white/10 px-4 py-2 text-xs text-white/60'>
                        Smooth preview
                      </div>
                    </div>
                    <div className='relative flex h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-[#080c18]'>
                      <div className='absolute inset-x-8 top-1/2 border-t border-dashed border-white/10' />
                      <div className='absolute inset-y-8 left-1/2 border-l border-dashed border-white/10' />
                      <div className='relative text-[210px] font-black leading-none tracking-tighter text-white'>
                        G
                      </div>
                      <div className='absolute left-[54%] top-[38%] h-4 w-4 rounded-full border-2 border-white bg-[#050814]' />
                      <div className='absolute left-[61%] top-[32%] h-3 w-3 rounded-full bg-white' />
                      <div className='absolute left-[55%] top-[39%] h-px w-20 rotate-[-22deg] bg-white/50' />
                      <div className='absolute left-[67%] top-[28%]'>
                        <div className='h-0 w-0 border-l-[14px] border-r-[4px] border-t-[22px] border-l-white border-r-transparent border-t-transparent' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id='features'
            className='grid gap-5 border-y border-white/10 bg-white/[0.03] px-0 py-16 md:grid-cols-2'
          >
            {features.map(feature => (
              <article
                key={feature.title}
                className='rounded-2xl border border-white/10 bg-white/[0.03] p-7'
              >
                <h3 className='text-xl font-semibold'>{feature.title}</h3>
                <p className='mt-3 leading-7 text-white/55'>{feature.text}</p>
              </article>
            ))}
          </section>

          <section className='grid gap-8 py-16 md:grid-cols-[1fr_0.8fr]'>
            <div className='max-w-2xl'>
              <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
                Pricing
              </p>
              <h3 className='mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl'>
                Pick the license that matches how long you expect to ship with
                it.
              </h3>
              <p className='mt-5 text-lg leading-8 text-white/60'>
                Chewpack is sold as a focused license, not a vague subscription
                wall. Choose the shortest plan that fits your workflow or lock
                in longer access for a better effective price.
              </p>
              <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-white/35'>
                    Fast start
                  </p>
                  <p className='mt-2 text-sm leading-6 text-white/70'>
                    Buy the 3-month option if you want to test the full editor
                    on a live project.
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-white/35'>
                    Best value
                  </p>
                  <p className='mt-2 text-sm leading-6 text-white/70'>
                    The 1-year license is the easiest upgrade when you know you
                    will keep designing.
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-white/35'>
                    One purchase
                  </p>
                  <p className='mt-2 text-sm leading-6 text-white/70'>
                    Lifetime makes sense if you want to own the workflow instead
                    of thinking about renewals.
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-[#0b1020] p-6 shadow-2xl shadow-black/30'>
              <div className='flex items-center justify-between'>
                <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
                  Payment stack
                </p>
                <span className='rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200'>
                  Secure Stripe flow
                </span>
              </div>
              <div className='mt-6 grid gap-3'>
                {[
                  'Card payment',
                  'Apple Pay',
                  'Google Pay',
                  'Invoice-ready receipt'
                ].map(item => (
                  <div
                    key={item}
                    className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3'
                  >
                    <span className='text-sm text-white/75'>{item}</span>
                    <span className='h-2.5 w-2.5 rounded-full bg-white/30' />
                  </div>
                ))}
              </div>
              <Link
                href='/checkout?plan=1y'
                className='mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85'
              >
                Choose the 1-year plan
              </Link>
            </div>
          </section>

          <section id='pricing' className='pb-20'>
            <div className='mb-6 flex items-end justify-between gap-4'>
              <div>
                <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
                  License cards
                </p>
                <h3 className='mt-3 text-3xl font-semibold tracking-tight md:text-4xl'>
                  Built to make the decision feel obvious.
                </h3>
              </div>
              <p className='max-w-md text-sm leading-6 text-white/50'>
                Each card is designed to answer the only real buying question:
                how long do you want to keep using the editor?
              </p>
            </div>
            <div className='grid gap-5 lg:grid-cols-3'>
              {pricingPlans.map(plan => (
                <article
                  key={plan.name}
                  className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6'
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${plan.accent}`}
                  />
                  <div className='flex items-center justify-between'>
                    <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/45'>
                      {plan.badge}
                    </span>
                    <span className='text-xs uppercase tracking-[0.25em] text-white/30'>
                      {plan.name}
                    </span>
                  </div>
                  <div className='mt-6'>
                    <p className='text-sm text-white/45'>{plan.cadence}</p>
                    <p className='mt-3 text-4xl font-semibold tracking-tight'>
                      {plan.price}
                    </p>
                    <p className='mt-4 text-sm leading-7 text-white/60'>
                      {plan.description}
                    </p>
                  </div>
                  <ul className='mt-6 space-y-3 text-sm text-white/75'>
                    {plan.features.map(feature => (
                      <li key={feature} className='flex items-center gap-3'>
                        <span className='h-2 w-2 rounded-full bg-white/50' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className='mt-7 inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black'
                  >
                    Select {plan.name}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
