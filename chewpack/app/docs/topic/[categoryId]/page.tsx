import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  categories,
  documentHref,
  documentsIn,
  featuresIn,
  findCategory
} from '@/content/docs'
import { Breadcrumbs } from '../../_components/Breadcrumbs'

export const dynamicParams = false

export function generateStaticParams () {
  return categories.map(({ id }) => ({ categoryId: id }))
}

export async function generateMetadata ({ params }: PageProps<'/docs/topic/[categoryId]'>): Promise<Metadata> {
  const category = findCategory((await params).categoryId)
  if (!category) return {}
  return { title: category.title, description: category.summary }
}

export default async function CategoryPage ({ params }: PageProps<'/docs/topic/[categoryId]'>) {
  const category = findCategory((await params).categoryId)
  if (!category) notFound()

  const categoryFeatures = featuresIn(category.id)
  const categoryDocuments = documentsIn(category.id)

  return (
    <div className='max-w-3xl'>
      <Breadcrumbs items={[]} />

      <header className='mt-6 flex items-start gap-5'>
        <span
          aria-hidden='true'
          className='flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-[#dce2e8] bg-white text-4xl font-semibold'
        >
          {category.glyph}
        </span>
        <div>
          <h1 className='text-4xl font-semibold leading-tight sm:text-5xl'>{category.title}</h1>
          <p className='mt-3 text-lg leading-8 text-[#53616e]'>{category.summary}</p>
        </div>
      </header>

      {categoryDocuments.length > 0 && (
        <ul className='mt-10 space-y-3'>
          {categoryDocuments.map(doc => (
            <li key={doc.id}>
              <Link
                href={documentHref(doc.id)}
                className='flex items-center justify-between gap-4 rounded-lg bg-[#101418] p-5 text-white transition hover:bg-[#26313a]'
              >
                <span>
                  <span className='block font-semibold'>{doc.title}</span>
                  <span className='mt-1 block text-sm text-[#c4ccd4]'>{doc.summary}</span>
                </span>
                <span aria-hidden='true' className='text-xl'>→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ul className='mt-10 divide-y divide-[#eef1f4] rounded-lg border border-[#dce2e8] bg-white'>
        {categoryFeatures.map(feature => (
          <li key={feature.id}>
            <Link href={`/docs/${feature.id}`} className='block px-5 py-4'>
              <span className='flex flex-wrap items-center gap-2 font-semibold text-[#101418]'>
                {feature.title}
                {feature.status === 'beta' && (
                  <span className='rounded border border-[#cfd6dd] px-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6b77]'>
                    Beta
                  </span>
                )}
              </span>
              <span className='mt-1 block leading-7 text-[#5f6b77]'>{feature.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
