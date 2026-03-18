import { NextRequest, NextResponse } from 'next/server'
import { publishToFacebook, publishToInstagram } from '@/lib/api/meta'
import { publishToLinkedIn } from '@/lib/api/linkedin'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { platforms, content, imageUrl } = body

  if (!platforms || !content) {
    return NextResponse.json({ error: 'platforms and content required' }, { status: 400 })
  }

  const results: Record<string, unknown> = {}

  await Promise.allSettled(
    platforms.map(async (platform: string) => {
      try {
        if (platform === 'facebook') {
          results.facebook = await publishToFacebook(content, imageUrl)
        } else if (platform === 'instagram' && imageUrl) {
          results.instagram = await publishToInstagram(imageUrl, content)
        } else if (platform === 'linkedin') {
          results.linkedin = await publishToLinkedIn(content, imageUrl)
        } else if (platform === 'instagram' && !imageUrl) {
          results.instagram = { error: 'Instagram requires an image URL' }
        }
      } catch (err) {
        results[platform] = { error: String(err) }
      }
    })
  )

  return NextResponse.json({ results, publishedAt: new Date().toISOString() })
}
