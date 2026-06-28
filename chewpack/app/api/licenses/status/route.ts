import { NextResponse } from 'next/server'
import { checkLicenseStatus } from '../../../lib/licenses/service'

export async function POST (request: Request) {
  const payload = (await request.json().catch(() => ({}))) as {
    activationToken?: string
    deviceId?: string
  }

  const result = await checkLicenseStatus({
    activationToken: payload.activationToken ?? '',
    deviceId: payload.deviceId ?? ''
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({
    entitlement: result.entitlement
  })
}
