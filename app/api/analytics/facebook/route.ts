import { NextResponse } from 'next/server'
import { getFacebookProfile, getFacebookPosts } from '@/lib/api/meta'

export async function GET() {
  try {
    const [profile, posts] = await Promise.allSettled([
      getFacebookProfile(),
      getFacebookPosts(10),
    ])
    return NextResponse.json({
      profile: profile.status === 'fulfilled' ? profile.value : null,
      posts: posts.status === 'fulfilled' ? posts.value : null,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
