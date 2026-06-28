export function addUtcMonths (date: Date, months: number) {
  const copy = new Date(date.getTime())
  copy.setUTCMonth(copy.getUTCMonth() + months)
  return copy
}

export function toIso (date: Date | string | null | undefined) {
  if (!date) return null
  return date instanceof Date ? date.toISOString() : date
}

export function isExpired (expiresAt: string | null) {
  return Boolean(expiresAt && Date.parse(expiresAt) <= Date.now())
}
