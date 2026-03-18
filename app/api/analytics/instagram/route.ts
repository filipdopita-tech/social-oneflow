import { NextResponse } from 'next/server'
import { getInstagramInsights, getInstagramMedia } from '@/lib/api/meta'

export async function GET() {
  try {
    const [insights, media] = await Promise.allSettled([
      getInstagramInsights('day'),
      getInstagramMedia(10),
    ])

    return NextResponse.json({
      insights: insights.status === 'fulfilled' ? insights.value : null,
      media: media.status === 'fulfilled' ? media.value : null,
      error: null,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
