import type { MetadataRoute } from 'next'
import { categories, documents, features, guideHref, guides } from '@/content/docs'
import { getSiteUrl } from './site'

export default function sitemap (): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  const docsPaths = [
    '/docs',
    '/docs/shortcuts',
    ...guides.map(guideHref),
    ...categories.map(category => `/docs/topic/${category.id}`),
    ...[...features, ...documents].map(item => `/docs/${item.id}`)
  ]

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    ...docsPaths.map(path => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ]
}
