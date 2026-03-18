import { NextResponse } from 'next/server'
import { getYouTubeChannelStats, getYouTubeVideos } from '@/lib/api/youtube'

export const revalidate = 300

export async function GET() {
  try {
    const [channel, videos] = await Promise.allSettled([
      getYouTubeChannelStats(),
      getYouTubeVideos(10),
    ])
    return NextResponse.json({
      channel: channel.status === 'fulfilled' ? channel.value : null,
      videos: videos.status === 'fulfilled' ? videos.value : null,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
