import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.LI_CLIENT_ID!
const CLIENT_SECRET = process.env.LI_CLIENT_SECRET!
const REDIRECT_URI = 'https://social.oneflow.cz/api/auth/linkedin/callback'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')
  const errorDesc = req.nextUrl.searchParams.get('error_description')

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#080810;color:#F0F0FF">
        <h2 style="color:#FF4D6D">LinkedIn chyba: ${error}</h2>
        <p>${errorDesc}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
  if (!code) {
    return new NextResponse('Chybí code parametr', { status: 400 })
  }

  // Exchange code for token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })
  const token = await tokenRes.json()

  if (!token.access_token) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#080810;color:#F0F0FF">
        <h2 style="color:#FF4D6D">Token exchange selhal</h2>
        <pre>${JSON.stringify(token, null, 2)}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Get profile
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
  const profile = await profileRes.json()

  // Try to get admin org pages
  const orgsRes = await fetch(
    'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,localizedName,vanityName)))',
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    }
  )
  const orgs = await orgsRes.json()

  // Extract org ID for oneflowcz
  const orgElements = orgs.elements ?? []
  const oneflowOrg = orgElements.find((e: Record<string, unknown>) => {
    const org = (e['organization~'] as Record<string, unknown> | undefined)
    return (org?.vanityName as string | undefined)?.toLowerCase().includes('oneflow')
  })
  const orgUrn = oneflowOrg?.organization as string | undefined

  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()

  return new NextResponse(
    `<html><body style="font-family:sans-serif;padding:40px;background:#080810;color:#F0F0FF">
      <h2 style="color:#00E5A0">✅ LinkedIn autorizace proběhla!</h2>
      <p><strong>Uživatel:</strong> ${profile.name} (${profile.email})</p>
      <p><strong>Token expires:</strong> ${expiresAt}</p>
      ${orgUrn ? `<p><strong>OneFlow org URN:</strong> ${orgUrn}</p>` : '<p style="color:#FFB800">⚠️ Firemní stránka nenalezena nebo token nemá r_organization_social scope</p>'}
      <hr style="border-color:rgba(255,255,255,0.1);margin:24px 0">
      <p style="color:#7B7B9A;font-size:12px">Zkopíruj níže a pošli do Claude Code:</p>
      <pre style="background:#16162A;padding:16px;border-radius:8px;font-size:11px;overflow:auto;color:#00D9FF">
ACCESS_TOKEN=${token.access_token}
EXPIRES_IN=${token.expires_in}
ORG_URN=${orgUrn ?? 'nenalezeno'}
      </pre>
      <p style="color:#7B7B9A;font-size:12px">Toto okno lze zavřít po zkopírování.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}
