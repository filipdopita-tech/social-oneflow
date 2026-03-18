const PAGE_TOKEN = process.env.META_PAGE_TOKEN!
const PAGE_ID = process.env.FB_PAGE_ID!
const IG_ID = process.env.IG_ACCOUNT_ID!

export async function getFacebookPageInsights(period = 'day', since?: string, until?: string) {
  const params = new URLSearchParams({
    metric: 'page_impressions,page_reach,page_engaged_users,page_post_engagements,page_fans,page_fan_adds,page_views_total',
    period,
    access_token: PAGE_TOKEN,
  })
  if (since) params.set('since', since)
  if (until) params.set('until', until)

  const res = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/insights?${params}`)
  if (!res.ok) throw new Error(`Meta API error: ${res.status}`)
  return res.json()
}

export async function getInstagramInsights(period = 'day') {
  const params = new URLSearchParams({
    metric: 'impressions,reach,profile_views,follower_count',
    period,
    access_token: PAGE_TOKEN,
  })
  const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/insights?${params}`)
  if (!res.ok) throw new Error(`IG API error: ${res.status}`)
  return res.json()
}

export async function getInstagramMedia(limit = 20) {
  const params = new URLSearchParams({
    fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,insights.metric(impressions,reach,saved,video_views)',
    limit: String(limit),
    access_token: PAGE_TOKEN,
  })
  const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media?${params}`)
  if (!res.ok) throw new Error(`IG media error: ${res.status}`)
  return res.json()
}

export async function getFacebookPosts(limit = 20) {
  const params = new URLSearchParams({
    fields: 'id,message,story,created_time,likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions,post_reach,post_engaged_users)',
    limit: String(limit),
    access_token: PAGE_TOKEN,
  })
  const res = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts?${params}`)
  if (!res.ok) throw new Error(`FB posts error: ${res.status}`)
  return res.json()
}

export async function publishToFacebook(message: string, photoUrl?: string) {
  const body: Record<string, string> = { access_token: PAGE_TOKEN, message }
  if (photoUrl) body.url = photoUrl

  const endpoint = photoUrl ? 'photos' : 'feed'
  const res = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function publishToInstagram(imageUrl: string, caption: string) {
  // Step 1: Create media container
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: PAGE_TOKEN }),
  })
  const container = await containerRes.json()
  if (!container.id) return { error: 'Container creation failed', details: container }

  // Step 2: Publish container
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: PAGE_TOKEN }),
  })
  return publishRes.json()
}
