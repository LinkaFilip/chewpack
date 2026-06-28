export type LicenseStatus = 'active' | 'canceled' | 'revoked'

export type LicenseRecord = {
  id: string
  code_hash: string
  plan_id: string
  customer_email: string
  stripe_payment_intent_id: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: LicenseStatus
  pending_months: number
  redeemed_at: string | null
  expires_at: string | null
  lifetime: boolean
  last_invoice_id: string | null
  email_sent_at: string | null
  created_at: string
  updated_at: string
}

export type LicenseActivationRecord = {
  id: string
  license_id: string
  device_id_hash: string
  activation_token_hash: string
  activated_at: string
  last_check_at: string
}

type StripeEventRecord = {
  id: string
  result: string
}

type DbValue = string | number | boolean | null
type DbRecord = Record<string, DbValue>

function firstReturnedRow<T> (rows: T[] | null, table: string) {
  if (!rows?.[0]) {
    throw new Error(`Supabase did not return a row for ${table}.`)
  }

  return rows[0]
}

function getSupabaseConfig () {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }

  return {
    restUrl: `${url.replace(/\/$/, '')}/rest/v1`,
    serviceKey
  }
}

function filterValue (value: string) {
  return encodeURIComponent(value)
}

async function supabaseRequest<T> (
  path: string,
  init: RequestInit & { allowConflict?: boolean } = {}
) {
  const { restUrl, serviceKey } = getSupabaseConfig()
  const response = await fetch(`${restUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  })

  if (response.status === 409 && init.allowConflict) {
    return null
  }

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${body}`)
  }

  if (response.status === 204) {
    return null
  }

  return await response.json() as T
}

async function selectOne<T> (path: string) {
  const rows = await supabaseRequest<T[]>(path, {
    headers: { Accept: 'application/json' }
  })

  return rows?.[0] ?? null
}

export async function insertStripeEvent (eventId: string, type: string) {
  const rows = await supabaseRequest<Array<{ id: string }>>('/stripe_events', {
    method: 'POST',
    body: JSON.stringify({
      id: eventId,
      type,
      result: 'processing'
    }),
    headers: { Prefer: 'return=representation' },
    allowConflict: true
  })

  if (!rows?.[0]) {
    const existing = await selectOne<StripeEventRecord>(
      `/stripe_events?id=eq.${filterValue(eventId)}&select=id,result`
    )

    if (existing?.result === 'failed' || existing?.result === 'not_subscription_invoice') {
      await supabaseRequest(`/stripe_events?id=eq.${filterValue(eventId)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          result: 'processing',
          error: null,
          processed_at: new Date().toISOString()
        }),
        headers: { Prefer: 'return=minimal' }
      })

      return true
    }
  }

  return Boolean(rows?.[0])
}

export async function finishStripeEvent (eventId: string, result: string, error?: string) {
  await supabaseRequest(`/stripe_events?id=eq.${filterValue(eventId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      result,
      error: error ?? null,
      processed_at: new Date().toISOString()
    }),
    headers: { Prefer: 'return=minimal' }
  })
}

export async function findLicenseById (id: string) {
  return await selectOne<LicenseRecord>(
    `/licenses?id=eq.${filterValue(id)}&select=*`
  )
}

export async function findLicenseByCodeHash (codeHash: string) {
  return await selectOne<LicenseRecord>(
    `/licenses?code_hash=eq.${filterValue(codeHash)}&select=*`
  )
}

export async function findLicenseByPaymentIntent (paymentIntentId: string) {
  return await selectOne<LicenseRecord>(
    `/licenses?stripe_payment_intent_id=eq.${filterValue(paymentIntentId)}&select=*`
  )
}

export async function findLicenseBySubscription (subscriptionId: string) {
  return await selectOne<LicenseRecord>(
    `/licenses?stripe_subscription_id=eq.${filterValue(subscriptionId)}&select=*`
  )
}

export async function createLicense (license: DbRecord) {
  const rows = await supabaseRequest<LicenseRecord[]>('/licenses', {
    method: 'POST',
    body: JSON.stringify(license),
    headers: { Prefer: 'return=representation' }
  })

  return firstReturnedRow(rows, 'licenses')
}

export async function updateLicense (id: string, patch: DbRecord) {
  const rows = await supabaseRequest<LicenseRecord[]>(
    `/licenses?id=eq.${filterValue(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        ...patch,
        updated_at: new Date().toISOString()
      }),
      headers: { Prefer: 'return=representation' }
    }
  )

  return firstReturnedRow(rows, 'licenses')
}

export async function findActivationByTokenHash (tokenHash: string) {
  return await selectOne<LicenseActivationRecord>(
    `/license_activations?activation_token_hash=eq.${filterValue(tokenHash)}&select=*`
  )
}

export async function findActivationsByLicense (licenseId: string) {
  return await supabaseRequest<LicenseActivationRecord[]>(
    `/license_activations?license_id=eq.${filterValue(licenseId)}&select=*`
  ) ?? []
}

export async function createActivation (activation: DbRecord) {
  const rows = await supabaseRequest<LicenseActivationRecord[]>('/license_activations', {
    method: 'POST',
    body: JSON.stringify(activation),
    headers: { Prefer: 'return=representation' }
  })

  return firstReturnedRow(rows, 'license_activations')
}

export async function updateActivation (id: string, patch: DbRecord) {
  const rows = await supabaseRequest<LicenseActivationRecord[]>(
    `/license_activations?id=eq.${filterValue(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
      headers: { Prefer: 'return=representation' }
    }
  )

  return firstReturnedRow(rows, 'license_activations')
}
