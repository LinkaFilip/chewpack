export const defaultSiteUrl = 'https://chewpack.app'

export function getSiteUrl () {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? defaultSiteUrl

  return siteUrl.replace(/\/$/, '')
}
