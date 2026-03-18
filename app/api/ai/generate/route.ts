import { NextRequest, NextResponse } from 'next/server'
import { generatePostVariants, parseDriveDocument } from '@/lib/api/gemini'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, content, platforms } = body

  if (action === 'generate_variants') {
    const variants = await generatePostVariants(content, platforms || ['linkedin', 'instagram', 'facebook', 'tiktok'])
    return NextResponse.json({ variants })
  }

  if (action === 'parse_document') {
    const parsed = await parseDriveDocument(content)
    return NextResponse.json({ parsed })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
