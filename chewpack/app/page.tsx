import Link from 'next/link'
import { SeoSchema } from './SeoSchema'

const features = [
  {
    title: 'Outline drawing',
    text: 'Build glyphs with editable nodes, clean handles and direct curve control.'
  },
  {
    title: 'Spacing and metrics',
    text: 'Tune widths and side bearings while checking how the typeface behaves in real words.'
  },
  {
    title: 'Font projects',
    text: 'Move from single characters to a complete project with glyph browsing and saved work.'
  },
  {
    title: 'Presentation export',
    text: 'Create polished demos that show the design process without screen-recording clutter.'
  }
]

const workflow = ['Draw', 'Space', 'Preview', 'Export']

export default function Home () {
  return (
    <>
      <SeoSchema />
      <main className='min-h-screen bg-[#f4f6f8] text-[#101418]'>
        <section className='mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8'>
          <header className='flex flex-col gap-4 border-b border-[#d8dde3] pb-5 sm:flex-row sm:items-center sm:justify-between'>
            <Link href='/' className='group inline-flex items-center gap-3'>
              <span className='grid h-10 w-10 place-items-center rounded-lg bg-[#101418] text-sm font-semibold text-white'>
                CP
              </span>
              <span>
                <span className='block text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>
                  Chewpack
                </span>
                <span className='block text-sm text-[#5f6b77]'>
                  Font editing software
                </span>
              </span>
            </Link>
            <nav className='flex flex-wrap items-center gap-2 text-sm'>
              <a
                href='#features'
                className='rounded-md px-3 py-2 font-medium text-[#5f6b77] transition hover:bg-white hover:text-[#101418]'
              >
                Features
              </a>
              <Link
                href='/checkout?plan=1y'
                className='rounded-md bg-[#101418] px-4 py-2.5 font-semibold text-white transition hover:bg-[#26313a]'
              >
                Buy license
              </Link>
            </nav>
          </header>

          <div className='grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14'>
            <div className='max-w-2xl'>
              <p className='inline-flex rounded-md border border-[#cfd6de] bg-white px-3 py-1.5 text-sm font-medium text-[#42606b]'>
                Typeface design, without generic vector friction
              </p>
              <h1 className='mt-6 text-5xl font-semibold leading-[0.98] tracking-normal text-[#101418] sm:text-6xl lg:text-7xl'>
                Make your own font. Keep it precise.
              </h1>
              <p className='mt-6 max-w-xl text-lg leading-8 text-[#53616e]'>
                Chewpack gives independent designers a focused workspace for
                drawing glyphs, refining outlines, checking spacing and preparing
                a typeface that feels intentional.
              </p>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href='/checkout?plan=1y'
                  className='rounded-md bg-[#101418] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#26313a]'
                >
                  Continue to checkout
                </Link>
                <a
                  href='#features'
                  className='rounded-md border border-[#c6ced7] bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#101418] transition hover:border-[#101418]'
                >
                  View workflow
                </a>
              </div>
            </div>

            <div className='relative'>
              <div className='overflow-hidden rounded-xl border border-[#cfd6de] bg-white shadow-[0_24px_80px_rgba(16,20,24,0.12)]'>
                <div className='flex items-center justify-between border-b border-[#e1e5ea] bg-[#fbfcfd] px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <span className='h-2.5 w-2.5 rounded-full bg-[#ff6b5f]' />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#f5bd3f]' />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#36c07e]' />
                  </div>
                  <p className='text-xs font-medium uppercase tracking-[0.18em] text-[#87929f]'>
                    Glyph editor
                  </p>
                </div>
                <div className='grid min-h-115 grid-cols-1 md:grid-cols-[120px_1fr]'>
                  <aside className='grid grid-cols-6 gap-2 border-b border-[#e1e5ea] bg-[#f7f9fb] p-4 md:block md:border-b-0 md:border-r'>
                    {'ABCDEGPRS'.split('').map(letter => (
                      <div
                        key={letter}
                        className={`mb-0 grid aspect-square place-items-center rounded-md border text-sm font-semibold md:mb-2 ${
                          letter === 'G'
                            ? 'border-[#101418] bg-[#101418] text-white'
                            : 'border-[#dce2e8] bg-white text-[#6a7580]'
                        }`}
                      >
                        {letter}
                      </div>
                    ))}
                  </aside>
                  <div className='p-4 sm:p-6'>
                    <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <p className='text-sm font-medium text-[#6a7580]'>
                          Editing glyph
                        </p>
                        <p className='text-2xl font-semibold'>G</p>
                      </div>
                      <div className='grid grid-cols-2 gap-2 text-xs text-[#5f6b77] sm:grid-cols-4'>
                        {workflow.map(item => (
                          <span
                            key={item}
                            className='rounded-md border border-[#dce2e8] bg-[#f7f9fb] px-3 py-2 text-center font-medium'
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='relative flex min-h-[310px] items-center justify-center overflow-hidden rounded-lg border border-[#dce2e8] bg-[#fbfcfd]'>
                      <div className='absolute inset-x-8 top-1/2 border-t border-dashed border-[#cbd3dc]' />
                      <div className='absolute inset-y-8 left-1/2 border-l border-dashed border-[#cbd3dc]' />
                      <div className='relative text-[min(42vw,220px)] font-black leading-none text-[#101418]'>
                        G
                      </div>
                      <div className='absolute left-[54%] top-[38%] h-4 w-4 rounded-sm border-2 border-[#18a0a6] bg-white' />
                      <div className='absolute left-[62%] top-[31%] h-3 w-3 rounded-sm bg-[#18a0a6]' />
                      <div className='absolute left-[55%] top-[39%] h-px w-20 rotate-[-22deg] bg-[#18a0a6]' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id='features'
          className='border-y border-[#d8dde3] bg-white px-4 py-14 sm:px-6 lg:px-8'
        >
          <div className='mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {features.map(feature => (
              <article
                key={feature.title}
                className='rounded-lg border border-[#dce2e8] bg-[#fbfcfd] p-6'
              >
                <h2 className='text-lg font-semibold'>{feature.title}</h2>
                <p className='mt-3 leading-7 text-[#5f6b77]'>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
