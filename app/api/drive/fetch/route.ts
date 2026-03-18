import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  // Extract document ID from Google Docs/Drive URL
  const docIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (!docIdMatch) return NextResponse.json({ error: 'Invalid Google Docs URL' }, { status: 400 })

  const docId = docIdMatch[1]

  try {
    // Export as plain text
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
    const res = await fetch(exportUrl, { redirect: 'follow' })

    if (!res.ok) {
      // Try as HTML for better structure
      const htmlRes = await fetch(`https://docs.google.com/document/d/${docId}/export?format=html`)
      if (!htmlRes.ok) {
        return NextResponse.json(
          { error: 'Cannot access document. Make sure it is publicly accessible.' },
          { status: 403 }
        )
      }
      const html = await htmlRes.text()
      // Strip HTML tags for basic text
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      return NextResponse.json({ text, docId, format: 'html' })
    }

    const text = await res.text()
    return NextResponse.json({ text, docId, format: 'txt' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
