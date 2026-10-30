import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  categoryHref,
  documentHref,
  documents,
  features,
  findDocument,
  findFeature,
  getCategory,
  getDocument,
  getFeature,
  getShortcut,
  readDocument,
  type DocumentRef,
  type Feature
} from '@/content/docs'
import { Breadcrumbs } from '../_components/Breadcrumbs'
import { Keys } from '../_components/Keys'
import { Markdown } from '../_components/Markdown'
import { MediaList } from '../_components/MediaList'

// Features and documents share this route; their ids never collide (checked in content/docs).
export const dynamicParams = false

export function generateStaticParams () {
  return [...features, ...documents].map(({ id }) => ({ slug: id }))
}

export async function generateMetadata ({ params }: PageProps<'/docs/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const item = findFeature(slug) ?? findDocument(slug)
  if (!item) return {}
  return { title: item.title, description: item.summary }
}

export default async function DocsSlugPage ({ params }: PageProps<'/docs/[slug]'>) {
  const { slug } = await params
  const feature = findFeature(slug)
  if (feature) return <FeaturePage feature={feature} />
  const doc = findDocument(slug)
  if (doc) return <DocumentPage doc={doc} />
  notFound()
}

function FeaturePage ({ feature }: { feature: Feature }) {
  const category = getCategory(feature.category)
  const doc = feature.doc ? getDocument(feature.doc) : null

  return (
    <article className='max-w-3xl'>
      <Breadcrumbs items={[{ href: categoryHref(category.id), label: category.title }]} />

      <header className='mt-6'>
        <h1 className='flex flex-wrap items-center gap-3 text-4xl font-semibold leading-tight sm:text-5xl'>
          {feature.title}
          {feature.status === 'beta' && (
            <span className='rounded-md border border-[#cfd6dd] bg-white px-2 py-0.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#5f6b77]'>
              Beta
            </span>
          )}
        </h1>
        <p className='mt-4 text-lg leading-8 text-[#53616e]'>{feature.summary}</p>

        {feature.where.length > 0 && (
          <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3'>
            <span className='text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>Where</span>
            <ul className='flex flex-wrap gap-2'>
              {feature.where.map(place => (
                <li key={place} className='rounded-md border border-[#dce2e8] bg-white px-2.5 py-1 text-sm text-[#36424d]'>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {doc && (
        <Link
          href={documentHref(doc.id)}
          className='mt-8 flex items-center justify-between gap-4 rounded-lg bg-[#101418] p-5 text-white transition hover:bg-[#26313a]'
        >
          <span>
            <span className='block font-semibold'>{doc.title}</span>
            <span className='mt-1 block text-sm text-[#c4ccd4]'>{doc.summary}</span>
          </span>
          <span aria-hidden='true' className='text-xl'>→</span>
        </Link>
      )}

      <div className='mt-4'>
        <Markdown source={feature.body} />
      </div>

      <MediaList media={feature.media} />

      {feature.shortcuts.length > 0 && (
        <section className='mt-12' aria-labelledby='shortcuts'>
          <h2 id='shortcuts' className='text-2xl font-semibold'>Shortcuts</h2>
          <ul className='mt-4 divide-y divide-[#eef1f4] rounded-lg border border-[#dce2e8] bg-white'>
            {feature.shortcuts.map(getShortcut).map(shortcut => (
              <li key={shortcut.id} className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
                <span className='text-[#36424d]'>{shortcut.action}</span>
                <Keys keys={shortcut.keys} className='text-sm' />
              </li>
            ))}
          </ul>
        </section>
      )}

      {feature.related.length > 0 && (
        <section className='mt-12' aria-labelledby='related'>
          <h2 id='related' className='text-2xl font-semibold'>Related</h2>
          <ul className='mt-4 grid gap-3 sm:grid-cols-2'>
            {feature.related.map(getFeature).map(related => (
              <li key={related.id}>
                <Link
                  href={`/docs/${related.id}`}
                  className='block h-full rounded-lg border border-[#dce2e8] bg-white px-4 py-3 transition hover:border-[#101418]'
                >
                  <span className='block font-semibold'>{related.title}</span>
                  <span className='mt-1 block text-sm leading-6 text-[#5f6b77]'>{related.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

function DocumentPage ({ doc }: { doc: DocumentRef }) {
  const category = getCategory(doc.category)

  // The document brings its own h1.
  return (
    <article className='max-w-3xl'>
      <Breadcrumbs items={[{ href: categoryHref(category.id), label: category.title }]} />
      <div className='mt-6'>
        <Markdown source={readDocument(doc)} />
      </div>
    </article>
  )
}
