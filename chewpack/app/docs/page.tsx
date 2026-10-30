import type { Metadata } from 'next'
import Link from 'next/link'
import {
  appVersion,
  categories,
  categoryHref,
  features,
  getShortcut,
  product,
  shortcuts
} from '@/content/docs'
import { DocsSearch, type SearchItem } from './_components/DocsSearch'
import { Keys } from './_components/Keys'

export const metadata: Metadata = {
  title: { absolute: 'ChewPack Docs' },
  description: `Tutorials, feature reference and keyboard shortcuts for ${product.name}. ${product.tagline}`
}

// Shortcut ids shown in the "everyday shortcuts" strip.
const everydayShortcuts = ['save-font', 'undo', 'tool-pen', 'preview-without-points', 'command-palette', 'shortcuts-window']

const searchItems: SearchItem[] = [
  ...features.map(feature => ({
    href: `/docs/${feature.id}`,
    title: feature.title,
    text: feature.summary,
    haystack: [feature.title, feature.summary, ...feature.where].join(' ').toLowerCase()
  })),
  ...shortcuts.map(shortcut => ({
    href: `/docs/shortcuts#${shortcut.id}`,
    title: shortcut.action,
    text: shortcut.menuPath ?? shortcut.group,
    keys: shortcut.keys,
    haystack: [shortcut.action, shortcut.menuPath ?? ''].join(' ').toLowerCase()
  }))
]

const cardClass = 'group flex h-full flex-col rounded-lg border border-[#dce2e8] bg-white p-6 transition hover:border-[#101418]'

export default function DocsHome () {
  return (
    <>
      <section>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>Documentation</p>
        <h1 className='mt-3 text-4xl font-semibold leading-tight sm:text-5xl'>
          Learn {product.name}
        </h1>
        <p className='mt-4 max-w-2xl text-lg leading-8 text-[#53616e]'>
          {product.tagline} A reference for every feature, and all the keyboard shortcuts.
        </p>
        {appVersion && (
          <p className='mt-2 text-sm text-[#5f6b77]'>Documented for {product.name} {appVersion}</p>
        )}
        <div className='mt-8'>
          <DocsSearch items={searchItems} />
        </div>
      </section>

      {/* Hidden for now; also re-add `guideHref` and `guides` to the imports.
      <section className='mt-16' aria-labelledby='start-here'>
        <h2 id='start-here' className='text-2xl font-semibold'>Start here</h2>
        <ul className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {guides.map(guide => (
            <li key={guide.id}>
              <Link href={guideHref(guide)} className={cardClass}>
                <span aria-hidden='true' className='block truncate text-5xl font-semibold leading-none text-[#101418]'>
                  {guide.specimen}
                </span>
                <span className='mt-6 block text-lg font-semibold'>{guide.title}</span>
                <span className='mt-2 block flex-1 leading-7 text-[#5f6b77]'>{guide.summary}</span>
                <span className='mt-4 block text-sm text-[#5f6b77]'>About {guide.minutes} minutes</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      */}

      <section className='mt-16' aria-labelledby='browse'>
        <h2 id='browse' className='text-2xl font-semibold'>Browse by topic</h2>
        <ul className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map(category => (
            <li key={category.id}>
              <Link href={categoryHref(category.id)} className={`${cardClass} sm:flex-row sm:items-start sm:gap-5`}>
                <span
                  aria-hidden='true'
                  className='flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#f4f6f8] text-3xl font-semibold text-[#101418]'
                >
                  {category.glyph}
                </span>
                <span className='mt-4 block sm:mt-0'>
                  <span className='block text-lg font-semibold'>{category.title}</span>
                  <span className='mt-1 block leading-7 text-[#5f6b77]'>{category.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className='mt-16' aria-labelledby='everyday'>
        <div className='flex flex-wrap items-baseline justify-between gap-3'>
          <h2 id='everyday' className='text-2xl font-semibold'>Everyday shortcuts</h2>
          <Link href='/docs/shortcuts' className='text-sm font-semibold text-[#101418] underline decoration-[#9aa6b2] underline-offset-4 hover:decoration-[#101418]'>
            All {shortcuts.length} shortcuts →
          </Link>
        </div>
        <ul className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {everydayShortcuts.map(getShortcut).map(shortcut => (
            <li key={shortcut.id}>
              <Link
                href={`/docs/shortcuts#${shortcut.id}`}
                className='flex items-center justify-between gap-4 rounded-lg border border-[#dce2e8] bg-white px-4 py-3 transition hover:border-[#101418]'
              >
                <span className='font-medium'>{shortcut.action}</span>
                <Keys keys={shortcut.keys} className='shrink-0 text-sm' />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
