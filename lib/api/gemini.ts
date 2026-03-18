export async function analyzeContentWithGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function generatePostVariants(content: string, platforms: string[]) {
  const prompt = `You are a social media expert. Adapt the following content for each platform. Return JSON with keys for each platform.

Content: "${content}"

Platforms: ${platforms.join(', ')}

For each platform, return:
- text: the adapted post text
- hashtags: array of relevant hashtags
- tip: one tip for best performance

Respond ONLY with valid JSON.`

  const result = await analyzeContentWithGemini(prompt)
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return {}
  }
}

export async function parseDriveDocument(docText: string) {
  const prompt = `Analyze this content document and extract structured social media posts.

Document:
"""
${docText.substring(0, 8000)}
"""

Return JSON with this structure:
{
  "posts": [
    {
      "id": "1",
      "platform": "linkedin|instagram|facebook|tiktok|youtube",
      "type": "post|reel|story|video",
      "content": "the post text",
      "hashtags": ["tag1", "tag2"],
      "suggestedTime": "morning|afternoon|evening",
      "tone": "professional|casual|inspirational"
    }
  ],
  "summary": "brief summary of the document",
  "contentType": "promotional|educational|entertainment|personal"
}

Respond ONLY with valid JSON.`

  const result = await analyzeContentWithGemini(prompt)
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { posts: [], summary: '', contentType: 'general' }
  } catch {
    return { posts: [], summary: '', contentType: 'general' }
  }
}
