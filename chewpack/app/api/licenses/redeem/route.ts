import { NextResponse } from 'next/server'
import { redeemLicenseCode } from '../../../lib/licenses/service'

export async function POST (request: Request) {
  const payload = (await request.json().catch(() => ({}))) as {
    code?: string
    deviceId?: string
    appVersion?: string
  }

  const result = await redeemLicenseCode({
    code: payload.code ?? '',
    deviceId: payload.deviceId ?? '',
    appVersion: payload.appVersion
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({
    activationToken: result.activationToken,
    entitlement: result.entitlement
  })
}
