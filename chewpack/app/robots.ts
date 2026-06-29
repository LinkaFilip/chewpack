import type { MetadataRoute } from 'next'
import { getSiteUrl } from './site'

export default function robots (): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/success', '/checkout/cancel']
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  }
}
