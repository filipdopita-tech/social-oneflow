import { NextResponse } from 'next/server'
import { getInstagramProfile, getInstagramMedia, getFacebookProfile, getFacebookPosts } from '@/lib/api/meta'
import { getLinkedInProfile } from '@/lib/api/linkedin'
import { getYouTubeChannelStats, getYouTubeVideos } from '@/lib/api/youtube'

export const revalidate = 300 // cache 5 minutes

export async function GET() {
  const [igProfile, igMedia, fbProfile, fbPosts, liProfile, ytChannel, ytVideos] = await Promise.allSettled([
    getInstagramProfile(),
    getInstagramMedia(6),
    getFacebookProfile(),
    getFacebookPosts(5),
    getLinkedInProfile(),
    getYouTubeChannelStats(),
    getYouTubeVideos(6),
  ])

  const ig = igProfile.status === 'fulfilled' ? igProfile.value : null
  const igM = igMedia.status === 'fulfilled' ? (igMedia.value?.data ?? []) : []
  const fb = fbProfile.status === 'fulfilled' ? fbProfile.value : null
  const fbP = fbPosts.status === 'fulfilled' ? (fbPosts.value?.data ?? []) : []
  const li = liProfile.status === 'fulfilled' ? liProfile.value : null
  const yt = ytChannel.status === 'fulfilled' ? ytChannel.value : null
  const ytV = ytVideos.status === 'fulfilled' ? ytVideos.value : []

  const totalLikes = igM.reduce((s: number, p: { like_count?: number }) => s + (p.like_count ?? 0), 0)
  const totalComments = igM.reduce((s: number, p: { comments_count?: number }) => s + (p.comments_count ?? 0), 0)
  const avgEngagement = igM.length > 0 ? ((totalLikes + totalComments) / igM.length).toFixed(1) : '0'

  return NextResponse.json({
    instagram: ig ? {
      username: ig.username,
      followers: ig.followers_count,
      following: ig.follows_count,
      posts: ig.media_count,
      bio: ig.biography,
      avatar: ig.profile_picture_url,
      avgEngagement,
      recentPosts: igM.slice(0, 6),
    } : null,
    facebook: fb ? {
      name: fb.name,
      fans: fb.fan_count,
      followers: fb.followers_count,
      recentPosts: fbP.slice(0, 5),
    } : null,
    linkedin: li ? {
      name: li.name,
      firstName: li.given_name,
      lastName: li.family_name,
      email: li.email,
      avatar: li.picture,
    } : null,
    youtube: yt ? {
      channelId: process.env.YT_CHANNEL_ID,
      title: yt.snippet?.title,
      description: yt.snippet?.description,
      thumbnail: yt.snippet?.thumbnails?.default?.url,
      subscribers: yt.statistics?.subscriberCount,
      views: yt.statistics?.viewCount,
      videos: yt.statistics?.videoCount,
      recentVideos: ytV.slice(0, 6),
    } : null,
    tiktok: null, // pending TikTok app approval
    fetchedAt: new Date().toISOString(),
  })
}
