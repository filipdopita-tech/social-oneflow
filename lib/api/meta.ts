const PAGE_TOKEN = process.env.META_PAGE_TOKEN!
const PAGE_ID = process.env.FB_PAGE_ID!
const IG_ID = process.env.IG_ACCOUNT_ID!
const GRAPH = 'https://graph.facebook.com/v21.0'

export async function getInstagramProfile() {
  try {
    const params = new URLSearchParams({
      fields: 'username,followers_count,follows_count,media_count,profile_picture_url,biography',
      access_token: PAGE_TOKEN,
    })
    const res = await fetch(`${GRAPH}/${IG_ID}?${params}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getInstagramMedia(limit = 15) {
  try {
    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count',
      limit: String(limit),
      access_token: PAGE_TOKEN,
    })
    const res = await fetch(`${GRAPH}/${IG_ID}/media?${params}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getFacebookProfile() {
  try {
    const params = new URLSearchParams({
      fields: 'name,fan_count,followers_count,about,picture.width(200)',
      access_token: PAGE_TOKEN,
    })
    const res = await fetch(`${GRAPH}/${PAGE_ID}?${params}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getFacebookPosts(limit = 10) {
  try {
    const params = new URLSearchParams({
      fields: 'id,message,story,created_time,likes.summary(true),comments.summary(true)',
      limit: String(limit),
      access_token: PAGE_TOKEN,
    })
    const res = await fetch(`${GRAPH}/${PAGE_ID}/posts?${params}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function publishToFacebook(message: string, photoUrl?: string) {
  try {
    const body: Record<string, string> = { access_token: PAGE_TOKEN, message }
    if (photoUrl) body.url = photoUrl

    const endpoint = photoUrl ? 'photos' : 'feed'
    const res = await fetch(`${GRAPH}/${PAGE_ID}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  } catch (err) {
    return { error: String(err) }
  }
}

export async function publishToInstagram(imageUrl: string, caption: string) {
  try {
    // Step 1: Create media container
    const containerRes = await fetch(`${GRAPH}/${IG_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: PAGE_TOKEN }),
    })
    const container = await containerRes.json()
    if (!container.id) return { error: 'Container creation failed', details: container }

    // Step 2: Publish container
    const publishRes = await fetch(`${GRAPH}/${IG_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: PAGE_TOKEN }),
    })
    return publishRes.json()
  } catch (err) {
    return { error: String(err) }
  }
}
