import Link from 'next/link'
import { SeoSchema } from './SeoSchema'
import Image from 'next/image'

/*
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
*/

const downloadUrl = '/downloads/ChewPackSetup-1.1.2.exe'

export default function Home () {
  return (
    <>
      <SeoSchema />
      <main className='min-h-screen bg-[#f4f6f8] text-[#101418]'>
        <section className='mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8'>
          <header className='flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between'>
            <Link href='/' className='group inline-flex items-center gap-3'>
              <Image
                src='/favicon.ico'
                alt='Chewpack'
                width={40}
                height={40}
                className='rounded-lg'
              />
              <span>
                <span className='block text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>
                  Chewpack
                </span>
                <span className='block text-sm text-[#5f6b77]'>Font editing software</span>
              </span>
            </Link>
            <nav className='flex flex-wrap items-center gap-2 text-sm'>
              {/* <a
                href='#features'
                className='rounded-md px-3 py-2 font-medium text-[#5f6b77] transition hover:bg-white hover:text-[#101418]'
              >
                Features
              </a> */}
              {/* <a
                href={downloadUrl}
                download
                className='rounded-md bg-[#101418] px-4 py-2.5 font-semibold text-white transition hover:bg-[#26313a]'
              >
                Download
              </a> */}
            </nav>
          </header>

          <div className='grid flex-1 items-center gap-10 py-10'>
            <div className='w-full'>
              <h1 className='text-5xl font-semibold leading-[0.98] tracking-normal text-[#101418] sm:text-6xl lg:text-7xl'>
                Make your own font. <br></br>Keep it precise.
              </h1>
              <p className='mt-6 max-w-xl text-lg leading-8 text-[#53616e]'>
                Chewpack gives independent designers a focused workspace for
                drawing glyphs, refining outlines, checking spacing and preparing
                a typeface that feels intentional.
              </p>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <a
                  href={downloadUrl}
                  download
                  className='inline-flex items-center justify-center gap-2 rounded-md bg-[#101418] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#26313a]'
                >
                  <svg
                    viewBox='0 0 16 16'
                    width='16'
                    height='16'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path d='M0 0h7.5v7.5H0zM8.5 0H16v7.5H8.5zM0 8.5h7.5V16H0zM8.5 8.5H16V16H8.5z' />
                  </svg>
                  Download for Windows
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* <section
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
        </section> */}
      </main>
    </>
  )
}
