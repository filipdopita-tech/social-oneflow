import { google } from 'googleapis'

function getYouTubeClient() {
  const auth = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
  )
  // Use the new full-scope refresh token (youtube.upload + youtube.readonly)
  auth.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN })
  return google.youtube({ version: 'v3', auth })
}

export async function getYouTubeChannelStats() {
  try {
    const yt = getYouTubeClient()
    const res = await yt.channels.list({
      part: ['statistics', 'snippet'],
      mine: true,
    })
    return res.data.items?.[0] ?? null
  } catch {
    return null
  }
}

export async function getYouTubeVideos(maxResults = 10) {
  try {
    const yt = getYouTubeClient()
    // Use channel ID directly — more reliable than forMine with search
    const channelId = process.env.YT_CHANNEL_ID || 'UCKKj9NsD5h5Fr-r9PttCxHQ'
    const res = await yt.search.list({
      part: ['snippet'],
      channelId,
      type: ['video'],
      maxResults,
      order: 'date',
    })
    return res.data.items ?? []
  } catch {
    return []
  }
}

export async function getYouTubeVideoStats(videoIds: string[]) {
  try {
    const yt = getYouTubeClient()
    const res = await yt.videos.list({
      part: ['statistics', 'snippet'],
      id: videoIds,
    })
    return res.data.items ?? []
  } catch {
    return []
  }
}
