import { randomUUID } from 'crypto'
import { isPlanId, plans, type PlanId } from '../../plans'
import {
  createActivation,
  createLicense,
  findActivationByTokenHash,
  findActivationsByLicense,
  findLicenseByCodeHash,
  findLicenseById,
  findLicenseByPaymentIntent,
  findLicenseBySubscription,
  updateActivation,
  updateLicense,
  type LicenseRecord
} from './db'
import {
  createActivationToken,
  generateLicenseCode,
  hashDeviceId,
  hashSecret,
  normalizeLicenseCode,
  verifyActivationToken
} from './crypto'
import { sendLicenseEmail } from './email'
import { addUtcMonths, isExpired } from './time'

type StripePaymentIntent = {
  id?: string
  receipt_email?: string | null
  customer?: string | null
  metadata?: Record<string, string>
}

type StripeInvoice = {
  id?: string
  customer?: string | null
  customer_email?: string | null
  subscription?: string | null
  metadata?: Record<string, string>
  subscription_details?: {
    metadata?: Record<string, string>
  }
  lines?: {
    data?: Array<{
      price?: {
        id?: string
      }
    }>
  }
}

function durationMonthsForPlan (planId: PlanId) {
  if (planId === 'lifetime') return 0
  return Number(plans[planId].stripe.recurring?.interval_count ?? 0)
}

function resolveInvoicePlanId (invoice: StripeInvoice) {
  const metadataPlan =
    invoice.metadata?.plan_id ??
    invoice.subscription_details?.metadata?.plan_id

  if (isPlanId(metadataPlan)) {
    return metadataPlan
  }

  const priceId = invoice.lines?.data?.[0]?.price?.id
  if (priceId && priceId === process.env.STRIPE_PRICE_3M) return '3m'
  if (priceId && priceId === process.env.STRIPE_PRICE_1Y) return '1y'

  return null
}

function activationPayload (license: LicenseRecord) {
  return {
    planId: license.plan_id,
    lifetime: license.lifetime,
    redeemedAt: license.redeemed_at,
    expiresAt: license.expires_at,
    valid: license.status !== 'revoked' && (license.lifetime || !isExpired(license.expires_at))
  }
}

async function createCodeLicense (input: {
  planId: PlanId
  customerEmail: string
  paymentIntentId?: string | null
  subscriptionId?: string | null
  customerId?: string | null
  invoiceId?: string | null
  pendingMonths: number
  lifetime: boolean
}) {
  const code = generateLicenseCode()
  const now = new Date().toISOString()
  const license = await createLicense({
    id: randomUUID(),
    code_hash: hashSecret(normalizeLicenseCode(code)),
    plan_id: input.planId,
    customer_email: input.customerEmail,
    stripe_payment_intent_id: input.paymentIntentId ?? null,
    stripe_subscription_id: input.subscriptionId ?? null,
    stripe_customer_id: input.customerId ?? null,
    status: 'active',
    pending_months: input.pendingMonths,
    redeemed_at: null,
    expires_at: null,
    lifetime: input.lifetime,
    last_invoice_id: input.invoiceId ?? null,
    email_sent_at: null,
    created_at: now,
    updated_at: now
  })

  const sent = await sendLicenseEmail({
    to: input.customerEmail,
    code,
    planId: input.planId
  })

  if (sent) {
    return await updateLicense(license.id, {
      email_sent_at: new Date().toISOString()
    })
  }

  return license
}

export async function issueLifetimeLicenseFromPaymentIntent (paymentIntent: StripePaymentIntent) {
  const planId = paymentIntent.metadata?.plan_id

  if (!paymentIntent.id || !isPlanId(planId) || planId !== 'lifetime') {
    return { issued: false, reason: 'not_lifetime_payment' }
  }

  const existing = await findLicenseByPaymentIntent(paymentIntent.id)
  if (existing) {
    return { issued: false, reason: 'already_issued', license: existing }
  }

  const email = paymentIntent.receipt_email ?? paymentIntent.metadata?.customer_email
  if (!email) {
    throw new Error(`Payment intent ${paymentIntent.id} does not include a customer email.`)
  }

  const license = await createCodeLicense({
    planId,
    customerEmail: email,
    paymentIntentId: paymentIntent.id,
    customerId: paymentIntent.customer ?? null,
    pendingMonths: 0,
    lifetime: true
  })

  return { issued: true, license }
}

export async function issueSubscriptionEntitlementFromInvoice (invoice: StripeInvoice) {
  const planId = resolveInvoicePlanId(invoice)

  if (!invoice.id || !invoice.subscription || !planId || planId === 'lifetime') {
    return { issued: false, reason: 'not_subscription_invoice' }
  }

  const months = durationMonthsForPlan(planId)
  const existing = await findLicenseBySubscription(invoice.subscription)

  if (existing) {
    if (existing.last_invoice_id === invoice.id) {
      return { issued: false, reason: 'invoice_already_applied', license: existing }
    }

    const now = new Date()
    const expiresAt = existing.redeemed_at
      ? addUtcMonths(
        existing.expires_at && Date.parse(existing.expires_at) > now.getTime()
          ? new Date(existing.expires_at)
          : now,
        months
      ).toISOString()
      : null

    const license = await updateLicense(existing.id, {
      pending_months: existing.redeemed_at ? existing.pending_months : existing.pending_months + months,
      expires_at: expiresAt,
      last_invoice_id: invoice.id,
      status: 'active'
    })

    return { issued: false, reason: 'extended', license }
  }

  const email = invoice.customer_email ?? invoice.metadata?.customer_email
  if (!email) {
    throw new Error(`Invoice ${invoice.id} does not include a customer email.`)
  }

  const license = await createCodeLicense({
    planId,
    customerEmail: email,
    subscriptionId: invoice.subscription,
    customerId: invoice.customer ?? null,
    invoiceId: invoice.id,
    pendingMonths: months,
    lifetime: false
  })

  return { issued: true, license }
}

export async function cancelSubscriptionLicense (subscriptionId: string) {
  const license = await findLicenseBySubscription(subscriptionId)
  if (!license) return null

  return await updateLicense(license.id, {
    status: 'canceled'
  })
}

export async function redeemLicenseCode (input: {
  code: string
  deviceId: string
  appVersion?: string
}) {
  const normalizedCode = normalizeLicenseCode(input.code)
  const deviceId = input.deviceId.trim()

  if (!normalizedCode || !deviceId) {
    return { ok: false as const, status: 400, error: 'Enter a license code and device id.' }
  }

  const license = await findLicenseByCodeHash(hashSecret(normalizedCode))
  if (!license || license.status === 'revoked') {
    return { ok: false as const, status: 404, error: 'License code was not found or is not active.' }
  }

  if (license.redeemed_at && !license.lifetime && isExpired(license.expires_at)) {
    return { ok: false as const, status: 403, error: 'This license has expired.' }
  }

  const now = new Date()
  let currentLicense = license

  if (!license.redeemed_at) {
    currentLicense = await updateLicense(license.id, {
      redeemed_at: now.toISOString(),
      expires_at: license.lifetime ? null : addUtcMonths(now, license.pending_months).toISOString()
    })
  }

  const deviceIdHash = hashDeviceId(deviceId)
  const activations = await findActivationsByLicense(currentLicense.id)
  const sameDeviceActivation = activations.find(activation => activation.device_id_hash === deviceIdHash)

  if (activations.length > 0 && !sameDeviceActivation) {
    return { ok: false as const, status: 409, error: 'This license code has already been redeemed on another device.' }
  }

  const token = createActivationToken(currentLicense.id, deviceIdHash)
  const tokenHash = hashSecret(token)
  const checkedAt = new Date().toISOString()

  if (sameDeviceActivation) {
    await updateActivation(sameDeviceActivation.id, {
      activation_token_hash: tokenHash,
      last_check_at: checkedAt
    })
  } else {
    await createActivation({
      id: randomUUID(),
      license_id: currentLicense.id,
      device_id_hash: deviceIdHash,
      activation_token_hash: tokenHash,
      activated_at: checkedAt,
      last_check_at: checkedAt
    })
  }

  return {
    ok: true as const,
    activationToken: token,
    entitlement: activationPayload(currentLicense)
  }
}

export async function checkLicenseStatus (input: {
  activationToken: string
  deviceId: string
}) {
  const deviceId = input.deviceId.trim()
  const token = input.activationToken.trim()

  if (!deviceId || !token) {
    return { ok: false as const, status: 400, error: 'Enter an activation token and device id.' }
  }

  const payload = verifyActivationToken(token)
  const deviceIdHash = hashDeviceId(deviceId)

  if (!payload?.licenseId || payload.deviceIdHash !== deviceIdHash) {
    return { ok: false as const, status: 401, error: 'Activation token is invalid.' }
  }

  const activation = await findActivationByTokenHash(hashSecret(token))
  if (!activation || activation.device_id_hash !== deviceIdHash) {
    return { ok: false as const, status: 401, error: 'Activation token is invalid.' }
  }

  const license = await findLicenseById(payload.licenseId)
  if (!license || license.id !== activation.license_id) {
    return { ok: false as const, status: 404, error: 'License was not found.' }
  }

  await updateActivation(activation.id, {
    last_check_at: new Date().toISOString()
  })

  return {
    ok: true as const,
    entitlement: activationPayload(license)
  }
}
