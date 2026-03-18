import { NextResponse } from 'next/server'
import { getInstagramMedia, getInstagramProfile } from '@/lib/api/meta'

export const revalidate = 300

export async function GET() {
  const [profile, media] = await Promise.allSettled([
    getInstagramProfile(),
    getInstagramMedia(20),
  ])

  const p = profile.status === 'fulfilled' ? profile.value : null
  const posts: Array<{ like_count?: number; comments_count?: number }> = media.status === 'fulfilled' ? (media.value?.data ?? []) : []

  // Sort by likes descending
  const sorted = [...posts].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))

  const totalLikes = posts.reduce((s, post) => s + (post.like_count ?? 0), 0)
  const totalComments = posts.reduce((s, post) => s + (post.comments_count ?? 0), 0)

  return NextResponse.json({
    profile: p,
    posts,
    topPosts: sorted.slice(0, 5),
    stats: {
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      avgLikes: posts.length ? Math.round(totalLikes / posts.length) : 0,
      avgComments: posts.length ? Math.round(totalComments / posts.length) : 0,
    },
  })
}
