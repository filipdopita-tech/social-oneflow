import { NextResponse } from 'next/server'
import { getFacebookPageInsights, getFacebookPosts } from '@/lib/api/meta'

export async function GET() {
  try {
    const [insights, posts] = await Promise.allSettled([
      getFacebookPageInsights('week'),
      getFacebookPosts(10),
    ])
    return NextResponse.json({
      insights: insights.status === 'fulfilled' ? insights.value : null,
      posts: posts.status === 'fulfilled' ? posts.value : null,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
