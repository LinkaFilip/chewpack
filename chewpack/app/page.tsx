import Link from 'next/link'
import { SeoSchema } from './SeoSchema'

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
              Continue to secure checkout
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
                  Continue to secure checkout
                </Link>
                <a
                  href='#features'
                  className='rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10'
                >
                  See features
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


        </div>
          <section
            id='features'
            className='grid gap-5 border-y border-white/10 bg-white/[0.03] px-6 py-16 md:grid-cols-2'
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
      </main>
    </>
  )
}
