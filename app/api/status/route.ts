import { NextResponse } from 'next/server'

export async function GET() {
  const checks = await Promise.allSettled([
    // Facebook / Instagram (same token)
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${process.env.META_PAGE_TOKEN}`).then(r => r.ok),
    // LinkedIn
    fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${process.env.LI_ACCESS_TOKEN}` },
    }).then(r => r.ok),
  ])

  const metaConnected = checks[0].status === 'fulfilled' ? checks[0].value : false
  const linkedinConnected = checks[1].status === 'fulfilled' ? checks[1].value : false

  return NextResponse.json({
    facebook: metaConnected,
    instagram: metaConnected, // same token
    linkedin: linkedinConnected,
    youtube: !!process.env.YT_REFRESH_TOKEN,
    tiktok: false, // pending approval
    pinterest: !!process.env.PINTEREST_APP_ID,
  })
}
