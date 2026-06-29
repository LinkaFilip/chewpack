import { plans, type PlanId } from '../../plans'

type SendLicenseEmailInput = {
  to: string
  code: string
  planId: PlanId
}

function getBaseUrl () {
  return process.env.LICENSE_REDEEM_BASE_URL?.replace(/\/$/, '') ?? 'https://chewpack.app'
}

export async function sendLicenseEmail ({ to, code, planId }: SendLicenseEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.LICENSE_EMAIL_FROM
  const supportEmail = process.env.LICENSE_SUPPORT_EMAIL ?? from

  if (!apiKey || !from) {
    console.warn('Skipping license email because RESEND_API_KEY or LICENSE_EMAIL_FROM is missing.', {
      to,
      planId
    })
    return false
  }

  const plan = plans[planId]
  const redeemBaseUrl = getBaseUrl()
  const text = [
    `Thanks for buying Chewpack ${plan.title}.`,
    '',
    `Your license code is: ${code}`,
    '',
    'Open Chewpack, choose license activation, and paste this code. Your access time starts when the code is redeemed.',
    `Redeem help: ${redeemBaseUrl}`,
    supportEmail ? `Support: ${supportEmail}` : ''
  ].filter(Boolean).join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h1>Your Chewpack license</h1>
      <p>Thanks for buying <strong>${plan.title}</strong>.</p>
      <p>Your license code is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:0.08em">${code}</p>
      <p>Open Chewpack, choose license activation, and paste this code. Your access time starts when the code is redeemed.</p>
      <p>Redeem help: <a href="${redeemBaseUrl}">${redeemBaseUrl}</a></p>
      ${supportEmail ? `<p>Support: <a href="mailto:${supportEmail}">${supportEmail}</a></p>` : ''}
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Your Chewpack ${plan.title} code`,
      text,
      html
    })
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend email failed (${response.status}): ${body}`)
  }

  return true
}
