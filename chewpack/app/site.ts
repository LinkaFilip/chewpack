export const defaultSiteUrl = 'https://gumpack.app'

export function getSiteUrl () {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? defaultSiteUrl

  return siteUrl.replace(/\/$/, '')
}
