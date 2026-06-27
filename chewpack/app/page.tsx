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

const steps = [
  'Sketch or create your letters',
  'Refine curves and spacing',
  'Test the font in real words',
  'Export and present your typeface'
]

const audiences = [
  'Graphic designers',
  'Brand designers',
  'Lettering artists',
  'Type-design students',
  'Small studios',
  'Creative freelancers'
]

export default function Home () {
  return (
    <main className='min-h-screen bg-[#050814] text-white'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-6 py-6'>
        <a href='#' className='text-xl font-semibold tracking-tight'>
          Gum Pack
        </a>

        <div className='hidden items-center gap-8 text-sm text-white/70 md:flex'>
          <a href='#features' className='hover:text-white'>
            Features
          </a>
          <a href='#workflow' className='hover:text-white'>
            Workflow
          </a>
          <a href='#pricing' className='hover:text-white'>
            Early Access
          </a>
        </div>

        <a
          href='#pricing'
          className='rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black'
        >
          Try Gum Pack
        </a>
      </nav>

      <section className='mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-14 md:grid-cols-2 md:pt-24'>
        <div>
          <p className='mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70'>
            Font creation software for designers
          </p>

          <h1 className='max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl'>
            Stop searching for the perfect font.
            <span className='block text-white/45'>Create it.</span>
          </h1>

          <p className='mt-6 max-w-xl text-lg leading-8 text-white/65'>
            Gum Pack helps designers turn original letterforms into working
            typefaces. Draw, refine, test and present custom fonts from one
            focused workspace.
          </p>

          <div className='mt-9 flex flex-col gap-4 sm:flex-row'>
            <a
              href='#pricing'
              className='rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-black hover:bg-white/85'
            >
              Get early access
            </a>

            <a
              href='#demo'
              className='rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white hover:bg-white/10'
            >
              Watch the concept
            </a>
          </div>

          <div className='mt-8 flex flex-wrap gap-3 text-sm text-white/45'>
            <span>Custom fonts</span>
            <span>•</span>
            <span>Glyph editing</span>
            <span>•</span>
            <span>Spacing tools</span>
            <span>•</span>
            <span>Demo export</span>
          </div>
        </div>

        <div id='demo' className='relative'>
          <div className='absolute -inset-8 rounded-[3rem] bg-white/10 blur-2xl' />

          <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020] shadow-2xl'>
            <div className='flex items-center gap-2 border-b border-white/10 px-5 py-4'>
              <span className='h-3 w-3 rounded-full bg-white/25' />
              <span className='h-3 w-3 rounded-full bg-white/15' />
              <span className='h-3 w-3 rounded-full bg-white/10' />
              <span className='ml-4 text-xs text-white/40'>
                Gum Pack — Glyph Editor
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
                    Smooth demo cursor
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

                <div className='mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-white/35'>
                    Live preview
                  </p>
                  <p className='mt-2 text-4xl font-semibold tracking-tight'>
                    Gum Type
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-y border-white/10 bg-white/[0.03]'>
        <div className='mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3'>
          <div>
            <p className='text-2xl font-semibold'>
              For people who need original type.
            </p>
          </div>

          <div className='md:col-span-2'>
            <p className='text-lg leading-8 text-white/60'>
              Most designers spend hours searching through fonts that almost
              fit. Gum Pack is for the moment when the right font does not exist
              yet — and you want to build it yourself.
            </p>
          </div>
        </div>
      </section>

      <section id='features' className='mx-auto max-w-7xl px-6 py-24'>
        <div className='mb-12 max-w-2xl'>
          <p className='mb-3 text-sm uppercase tracking-[0.3em] text-white/35'>
            Features
          </p>
          <h2 className='text-4xl font-semibold tracking-tight md:text-5xl'>
            Everything focused on one job: making a font.
          </h2>
        </div>

        <div className='grid gap-5 md:grid-cols-2'>
          {features.map(feature => (
            <article
              key={feature.title}
              className='rounded-2xl border border-white/10 bg-white/[0.03] p-7'
            >
              <h3 className='text-xl font-semibold'>{feature.title}</h3>
              <p className='mt-3 leading-7 text-white/55'>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id='workflow' className='mx-auto max-w-7xl px-6 pb-24'>
        <div className='grid gap-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12'>
          <div>
            <p className='mb-3 text-sm uppercase tracking-[0.3em] text-white/35'>
              Workflow
            </p>
            <h2 className='text-4xl font-semibold tracking-tight'>
              From sketch to usable typeface.
            </h2>
            <p className='mt-5 leading-8 text-white/60'>
              Gum Pack keeps the process visual and direct, so designers can
              focus on shaping letters instead of fighting complicated tools.
            </p>
          </div>

          <div className='space-y-4'>
            {steps.map((step, index) => (
              <div
                key={step}
                className='flex items-center gap-5 rounded-2xl border border-white/10 bg-[#050814] p-5'
              >
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black'>
                  {index + 1}
                </span>
                <p className='text-lg font-medium'>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 pb-24'>
        <div className='mb-10 max-w-2xl'>
          <p className='mb-3 text-sm uppercase tracking-[0.3em] text-white/35'>
            Built for
          </p>
          <h2 className='text-4xl font-semibold tracking-tight'>
            A small audience, but the right one.
          </h2>
        </div>

        <div className='flex flex-wrap gap-3'>
          {audiences.map(audience => (
            <span
              key={audience}
              className='rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-white/70'
            >
              {audience}
            </span>
          ))}
        </div>
      </section>

      <section id='pricing' className='mx-auto max-w-7xl px-6 pb-28'>
        <div className='overflow-hidden rounded-[2.5rem] border border-white/10 bg-white text-black'>
          <div className='grid gap-8 p-8 md:grid-cols-[1fr_0.8fr] md:p-12'>
            <div>
              <p className='mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-black/40'>
                Early access
              </p>

              <h2 className='max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl'>
                Create your first custom font with Gum Pack.
              </h2>

              <p className='mt-6 max-w-xl text-lg leading-8 text-black/60'>
                Join the early version and help shape a font editor made for
                independent designers, lettering artists and small studios.
              </p>

              <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <a
                  href='mailto:hello@gumpack.app?subject=Gum Pack Early Access'
                  className='rounded-full bg-black px-7 py-4 text-center text-sm font-semibold text-white hover:bg-black/80'
                >
                  Request early access
                </a>

                <a
                  href='#features'
                  className='rounded-full border border-black/10 px-7 py-4 text-center text-sm font-semibold text-black hover:bg-black/5'
                >
                  See features
                </a>
              </div>
            </div>

            <div className='rounded-[2rem] bg-black p-6 text-white'>
              <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
                What you get
              </p>

              <ul className='mt-6 space-y-4 text-white/70'>
                <li>✓ Glyph drawing and editing</li>
                <li>✓ Font project saving</li>
                <li>✓ Spacing and preview tools</li>
                <li>✓ Social demo video export concept</li>
                <li>✓ Early feature feedback access</li>
              </ul>

              <div className='mt-8 rounded-2xl bg-white/10 p-5'>
                <p className='text-sm text-white/45'>Positioning line</p>
                <p className='mt-2 text-xl font-semibold'>
                  Do not find the right font. Create it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
