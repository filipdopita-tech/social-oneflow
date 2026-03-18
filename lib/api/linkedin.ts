const LI_TOKEN = process.env.LI_ACCESS_TOKEN!
const PERSON_URN = process.env.LI_PERSON_URN!

export async function getLinkedInProfile() {
  try {
    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${LI_TOKEN}` },
    })
    if (!res.ok) return null
    return res.json() // returns: {sub, name, given_name, family_name, email, picture}
  } catch {
    return null
  }
}

export async function publishToLinkedIn(text: string, imageUrl?: string) {
  const body: Record<string, unknown> = {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
        ...(imageUrl && {
          media: [{
            status: 'READY',
            description: { text: text.substring(0, 200) },
            originalUrl: imageUrl,
          }],
        }),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })
  return res.json()
}
