import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'crypto'

function getHashSecret () {
  const secret = process.env.LICENSE_HASH_SECRET
  if (!secret) {
    throw new Error('Missing LICENSE_HASH_SECRET environment variable.')
  }

  return secret
}

function base64Url (value: Buffer | string) {
  return Buffer.from(value).toString('base64url')
}

function sign (value: string) {
  return createHmac('sha256', getHashSecret()).update(value).digest('base64url')
}

export function hashSecret (value: string) {
  return createHmac('sha256', getHashSecret())
    .update(value.trim())
    .digest('hex')
}

export function hashDeviceId (deviceId: string) {
  return hashSecret(`device:${deviceId.trim()}`)
}

export function normalizeLicenseCode (code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

export function generateLicenseCode () {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let body = ''

  for (const byte of randomBytes(16)) {
    body += alphabet[byte % alphabet.length]
  }

  return `CP-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}`
}

export function createActivationToken (licenseId: string, deviceIdHash: string) {
  const payload = {
    licenseId,
    deviceIdHash,
    nonce: randomUUID(),
    issuedAt: new Date().toISOString()
  }
  const encodedPayload = base64Url(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function verifyActivationToken (token: string) {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expected = sign(encodedPayload)
  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(signature)

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      licenseId?: string
      deviceIdHash?: string
    }

    if (!payload.licenseId || !payload.deviceIdHash) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
