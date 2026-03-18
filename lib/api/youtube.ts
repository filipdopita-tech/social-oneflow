import { google } from 'googleapis'

function getYouTubeClient() {
  const auth = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
  )
  auth.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN })
  return google.youtube({ version: 'v3', auth })
}

export async function getYouTubeChannelStats() {
  const yt = getYouTubeClient()
  const res = await yt.channels.list({
    part: ['statistics', 'snippet'],
    mine: true,
  })
  return res.data.items?.[0] ?? null
}

export async function getYouTubeVideos(maxResults = 20) {
  const yt = getYouTubeClient()
  const res = await yt.search.list({
    part: ['snippet'],
    forMine: true,
    type: ['video'],
    maxResults,
    order: 'date',
  })
  return res.data.items ?? []
}

export async function getYouTubeVideoStats(videoIds: string[]) {
  const yt = getYouTubeClient()
  const res = await yt.videos.list({
    part: ['statistics', 'snippet'],
    id: videoIds,
  })
  return res.data.items ?? []
}
