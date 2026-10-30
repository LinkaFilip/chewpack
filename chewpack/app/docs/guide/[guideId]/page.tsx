import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { documentHref, findGuide, getDocument, getFeature, guides } from '@/content/docs'
import { Breadcrumbs } from '../../_components/Breadcrumbs'
import { CodeBlock } from '../../_components/CodeBlock'
import { Keys } from '../../_components/Keys'

export const dynamicParams = false

export function generateStaticParams () {
  return guides.map(({ id }) => ({ guideId: id }))
}

export async function generateMetadata ({ params }: PageProps<'/docs/guide/[guideId]'>): Promise<Metadata> {
  const guide = findGuide((await params).guideId)
  if (!guide) return {}
  return { title: guide.title, description: guide.summary }
}

// Steps hold either CSS or Python; only CSS has lines ending in "{" or ";".
function codeLanguage (code: string) {
  return /[{;]\s*$/m.test(code) ? 'css' : 'python'
}

export default async function GuidePage ({ params }: PageProps<'/docs/guide/[guideId]'>) {
  const guide = findGuide((await params).guideId)
  if (!guide) notFound()

  const doc = guide.doc ? getDocument(guide.doc) : null

  return (
    <article className='max-w-3xl'>
      <Breadcrumbs items={[]} />

      <header className='mt-6'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6b77]'>
          Guide · About {guide.minutes} minutes
        </p>
        <h1 className='mt-3 text-4xl font-semibold leading-tight sm:text-5xl'>{guide.title}</h1>
        <p className='mt-4 text-lg leading-8 text-[#53616e]'>{guide.summary}</p>
      </header>

      <ol className='mt-10 space-y-5'>
        {guide.steps.map((step, index) => (
          <li key={index} className='rounded-lg border border-[#dce2e8] bg-white p-5 sm:p-6'>
            <div className='flex gap-4'>
              <span
                aria-hidden='true'
                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#101418] text-sm font-semibold text-white'
              >
                {index + 1}
              </span>
              <div className='min-w-0 flex-1'>
                <h2 className='text-lg font-semibold leading-8'>
                  <span className='sr-only'>Step {index + 1}: </span>
                  {step.title}
                </h2>
                <p className='mt-2 leading-7 text-[#36424d]'>{step.text}</p>
                {step.keys.length > 0 && <Keys keys={step.keys} className='mt-3 text-sm' />}
                {step.code && <CodeBlock code={step.code} language={codeLanguage(step.code)} />}
                {step.features.length > 0 && (
                  <ul className='mt-4 flex flex-wrap gap-2'>
                    {step.features.map(getFeature).map(feature => (
                      <li key={feature.id}>
                        <Link
                          href={`/docs/${feature.id}`}
                          className='inline-block rounded-md border border-[#dce2e8] bg-[#fbfcfd] px-2.5 py-1 text-sm font-medium text-[#36424d] transition hover:border-[#101418] hover:text-[#101418]'
                        >
                          {feature.title} <span aria-hidden='true'>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {doc && (
        <Link
          href={documentHref(doc.id)}
          className='mt-10 flex items-center justify-between gap-4 rounded-lg bg-[#101418] p-5 text-white transition hover:bg-[#26313a]'
        >
          <span>
            <span className='block font-semibold'>{doc.title}</span>
            <span className='mt-1 block text-sm text-[#c4ccd4]'>{doc.summary}</span>
          </span>
          <span aria-hidden='true' className='text-xl'>→</span>
        </Link>
      )}
    </article>
  )
}
