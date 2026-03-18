import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  const [fb, ig, yt] = await Promise.allSettled([
    fetch(`${baseUrl}/api/analytics/facebook`).then(r => r.json()),
    fetch(`${baseUrl}/api/analytics/instagram`).then(r => r.json()),
    fetch(`${baseUrl}/api/analytics/youtube`).then(r => r.json()),
  ])

  return NextResponse.json({
    facebook: fb.status === 'fulfilled' ? fb.value : null,
    instagram: ig.status === 'fulfilled' ? ig.value : null,
    youtube: yt.status === 'fulfilled' ? yt.value : null,
    fetchedAt: new Date().toISOString(),
  })
}
