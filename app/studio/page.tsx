'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, Upload, Link2, Clock, Tag, Users, Sparkles, RefreshCw, Scissors, Zap, CheckCircle,
  Smartphone, Monitor, ChevronDown, X, FolderOpen, Calendar,
} from 'lucide-react'

const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube']
const CHAR_LIMITS: Record<string, number> = {
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  facebook: 63206,
  youtube: 5000,
}

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  tiktok: '#00D9FF',
  facebook: '#1877F2',
  youtube: '#FF4444',
}

const DEMO_CONTENT: Record<string, string> = {
  instagram: `💡 Víte, že složené úročení je 8. div světa?

Pokud investujete 10 000 Kč měsíčně s průměrným výnosem 10% ročně, za 20 let máte přes 7,5 milionu korun.

To je síla pasivního investování s OneFlow. ✨

Naše platforma vám umožní:
→ Investovat od 5 000 Kč
→ Diverzifikovat do firemních dluhopisů
→ Sledovat výkon v reálném čase

Zanechte komentář "CHCI VĚDĚT VÍC" a pošleme vám bezplatnou analýzu. 👇

#investice #pasivniprijem #oneflow #finance #ceske firmy`,
  linkedin: `Pracoval jsem s více než 50 českými foundrery.

Všichni měli jeden společný problém: cash flow.

Ne nedostatek zákazníků. Ne špatný produkt. Cash flow.

Proto vznikl OneFlow — platforma, která propojuje české firmy s investory hledajícími stabilní výnos.

Výsledek? 847 spokojených investorů, 23 financovaných firem, průměrný roční výnos 11,2%.

Pokud řešíte provozní financování nebo hledáte stabilní alternativu k bankovním produktům — rád se potkám.

#fintech #investice #B2B #OneFlow`,
}

interface ParsedPost {
  id: string
  platform: string
  type: string
  content: string
  hashtags: string[]
  suggestedTime: string
  tone: string
}

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

export default function StudioPage() {
  const [activePlatform, setActivePlatform] = useState('instagram')
  const [content, setContent] = useState(DEMO_CONTENT['instagram'] || '')
  const [mediaUrl, setMediaUrl] = useState('')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [driveUrl, setDriveUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importStep, setImportStep] = useState(0)
  const [importError, setImportError] = useState('')
  const [parsedPosts, setParsedPosts] = useState<ParsedPost[]>([])
  const [tags, setTags] = useState(['investice', 'oneflow', 'finance'])
  const [newTag, setNewTag] = useState('')
  const [scheduledAt, setScheduledAt] = useState('2026-03-19T10:00')
  const [publishing, setPublishing] = useState(false)
  const [selectedPublishPlatforms, setSelectedPublishPlatforms] = useState<string[]>(['facebook', 'linkedin'])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [generatingVariants, setGeneratingVariants] = useState(false)

  const charLimit = CHAR_LIMITS[activePlatform]
  const charCount = content.length
  const charPercent = Math.min((charCount / charLimit) * 100, 100)
  const charColor = charPercent > 90 ? '#FF4D6D' : charPercent > 75 ? '#FFB800' : '#00E5A0'

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handlePlatformChange = (p: string) => {
    setActivePlatform(p)
    if (DEMO_CONTENT[p]) setContent(DEMO_CONTENT[p])
  }

  const handleImport = async () => {
    if (!driveUrl) return
    setImporting(true)
    setImportStep(1)
    setImportError('')
    setParsedPosts([])

    try {
      // Step 1: Fetch document text
      setImportStep(1)
      const fetchRes = await fetch('/api/drive/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: driveUrl }),
      })
      const fetchData = await fetchRes.json()
      if (fetchData.error) throw new Error(fetchData.error)

      // Step 2: Parse with AI
      setImportStep(2)
      const parseRes = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'parse_document', content: fetchData.text }),
      })
      const parseData = await parseRes.json()

      // Step 3: Done
      setImportStep(3)
      const posts: ParsedPost[] = parseData.parsed?.posts || []
      setParsedPosts(posts)

      if (posts.length > 0) {
        const first = posts[0]
        setContent(first.content + (first.hashtags?.length ? '\n\n' + first.hashtags.map((h: string) => `#${h}`).join(' ') : ''))
        setActivePlatform(first.platform in CHAR_LIMITS ? first.platform : 'instagram')
        showToast(`Importováno ${posts.length} příspěvků z dokumentu`, 'success')
      } else {
        setContent(fetchData.text.substring(0, 2000))
        showToast('Dokument importován, AI nenašla strukturované příspěvky', 'info')
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : String(err))
      showToast('Chyba při importu: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setImporting(false)
    }
  }

  const handleGenerateVariants = async () => {
    if (!content.trim()) return
    setGeneratingVariants(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_variants',
          content,
          platforms: ['linkedin', 'instagram', 'facebook'],
        }),
      })
      const data = await res.json()
      if (data.variants && data.variants[activePlatform]) {
        const variant = data.variants[activePlatform]
        setContent(variant.text + (variant.hashtags?.length ? '\n\n' + variant.hashtags.map((h: string) => `#${h}`).join(' ') : ''))
        showToast('Obsah přepsán pro ' + activePlatform, 'success')
      }
    } catch {
      showToast('Chyba při generování variant', 'error')
    } finally {
      setGeneratingVariants(false)
    }
  }

  const handlePublish = async () => {
    if (!content.trim() || selectedPublishPlatforms.length === 0) {
      showToast('Vyber alespoň jednu platformu a zadej obsah', 'error')
      return
    }
    setPublishing(true)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPublishPlatforms,
          content,
          imageUrl: mediaUrl || undefined,
        }),
      })
      const data = await res.json()
      if (data.results) {
        Object.entries(data.results).forEach(([platform, result]) => {
          const r = result as Record<string, unknown>
          if (r.error) {
            showToast(`${platform}: ${r.error}`, 'error')
          } else if (r.id) {
            showToast(`${platform}: Publikováno! ID: ${r.id}`, 'success')
          } else {
            showToast(`${platform}: Odpověď přijata`, 'info')
          }
        })
      }
    } catch (err) {
      showToast('Chyba při publikování: ' + String(err), 'error')
    } finally {
      setPublishing(false)
    }
  }

  const togglePublishPlatform = (p: string) => {
    setSelectedPublishPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="px-4 py-3 rounded-xl text-sm font-medium max-w-xs"
              style={{
                backgroundColor: toast.type === 'success' ? 'rgba(0,229,160,0.15)' : toast.type === 'error' ? 'rgba(255,77,109,0.15)' : 'rgba(107,91,255,0.15)',
                border: `1px solid ${toast.type === 'success' ? 'rgba(0,229,160,0.4)' : toast.type === 'error' ? 'rgba(255,77,109,0.4)' : 'rgba(107,91,255,0.4)'}`,
                color: toast.type === 'success' ? '#00E5A0' : toast.type === 'error' ? '#FF4D6D' : '#6B5BFF',
              }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LEFT PANEL */}
      <div className="flex flex-col overflow-hidden" style={{ width: '55%', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h1 className="text-xl font-bold mb-1" style={{ color: '#F0F0FF' }}>Content Studio</h1>
          <p className="text-sm" style={{ color: '#7B7B9A' }}>Vytvářej a plánuj obsah pro všechny platformy</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Google Drive Import */}
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(107,91,255,0.06), rgba(0,217,255,0.04))',
              border: '1px solid rgba(107,91,255,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen size={16} style={{ color: '#6B5BFF' }} />
              <span className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>Import z Google Drive</span>
            </div>
            <div
              className="rounded-xl p-4 mb-3 flex flex-col items-center justify-center gap-2"
              style={{
                border: '1px dashed rgba(107,91,255,0.4)',
                backgroundColor: 'rgba(107,91,255,0.04)',
                minHeight: 80,
              }}
            >
              <Link2 size={20} style={{ color: '#6B5BFF' }} />
              <input
                type="text"
                placeholder="Vlož odkaz na Google Drive nebo Docs..."
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="w-full bg-transparent text-sm text-center outline-none"
                style={{ color: '#F0F0FF' }}
              />
              <p className="text-xs" style={{ color: '#7B7B9A' }}>nebo přetáhni odkaz sem</p>
            </div>
            <AnimatePresence>
              {importing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 space-y-2"
                >
                  {[
                    { step: 1, label: 'Stahování dokumentu...' },
                    { step: 2, label: 'AI analýza obsahu...' },
                    { step: 3, label: 'Extrakce příspěvků...' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-2 text-xs" style={{ color: importStep >= s.step ? '#00E5A0' : '#7B7B9A' }}>
                      <CheckCircle size={12} style={{ opacity: importStep >= s.step ? 1 : 0.3 }} />
                      {s.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {importError && (
              <p className="text-xs mb-3 px-2 py-1.5 rounded-lg" style={{ color: '#FF4D6D', backgroundColor: 'rgba(255,77,109,0.1)' }}>
                {importError}
              </p>
            )}
            {parsedPosts.length > 0 && !importing && (
              <div className="mb-3 space-y-1">
                <p className="text-xs font-semibold mb-2" style={{ color: '#00E5A0' }}>
                  {parsedPosts.length} příspěvků importováno
                </p>
                {parsedPosts.map((post, i) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      setContent(post.content + (post.hashtags?.length ? '\n\n' + post.hashtags.map((h: string) => `#${h}`).join(' ') : ''))
                      setActivePlatform(post.platform in CHAR_LIMITS ? post.platform : 'instagram')
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-all"
                    style={{ backgroundColor: 'rgba(107,91,255,0.08)', color: '#7B7B9A', border: '1px solid rgba(107,91,255,0.15)' }}
                  >
                    <span
                      className="font-semibold mr-2"
                      style={{ color: platformColors[post.platform] || '#6B5BFF' }}
                    >
                      {post.platform.toUpperCase().slice(0, 2)}
                    </span>
                    {post.content.slice(0, 60)}...
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleImport}
              disabled={!driveUrl || importing}
              className="w-full py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: driveUrl ? '#6B5BFF' : 'rgba(107,91,255,0.2)',
                color: driveUrl ? '#fff' : '#7B7B9A',
                opacity: importing ? 0.7 : 1,
              }}
            >
              {importing ? 'Importuji...' : 'Importovat obsah'}
            </button>
          </div>

          {/* Platform Tabs */}
          <div>
            <div className="flex gap-1 mb-4 rounded-xl p-1" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePlatformChange(p)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: activePlatform === p ? platformColors[p] + '20' : 'transparent',
                    color: activePlatform === p ? platformColors[p] : '#7B7B9A',
                    border: activePlatform === p ? `1px solid ${platformColors[p]}40` : '1px solid transparent',
                  }}
                >
                  {p === 'instagram' ? 'IG' : p === 'linkedin' ? 'LI' : p === 'tiktok' ? 'TT' : p === 'facebook' ? 'FB' : 'YT'}
                </button>
              ))}
            </div>

            {/* Text Editor */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder={`Napište obsah pro ${activePlatform}...`}
                className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{ color: '#F0F0FF' }}
              />
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${charPercent}%`, backgroundColor: charColor }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: charColor }}>{charCount}/{charLimit}</span>
                </div>
                <span className="text-xs" style={{ color: '#7B7B9A' }}>
                  {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} limit
                </span>
              </div>
            </div>

            {/* AI Actions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={handleGenerateVariants}
                disabled={generatingVariants}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: 'rgba(107,91,255,0.1)',
                  border: '1px solid rgba(107,91,255,0.2)',
                  color: '#6B5BFF',
                  opacity: generatingVariants ? 0.7 : 1,
                }}
              >
                <RefreshCw size={12} className={generatingVariants ? 'animate-spin' : ''} />
                {generatingVariants ? 'Generuji...' : 'Přepsat pro platformu'}
              </button>
              {[
                { icon: Scissors, label: 'Zkrátit' },
                { icon: Zap, label: 'Generovat hooks' },
                { icon: CheckCircle, label: 'Brand voice' },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: 'rgba(107,91,255,0.1)',
                    border: '1px solid rgba(107,91,255,0.2)',
                    color: '#6B5BFF',
                  }}
                >
                  <a.icon size={12} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media URL */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#7B7B9A' }}>Média (URL obrázku)</label>
            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Upload size={14} style={{ color: '#7B7B9A' }} />
              <input
                type="text"
                placeholder="https://... (veřejná URL obrázku pro Instagram)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#F0F0FF' }}
              />
            </div>
          </div>

          {/* Publish Platform Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#7B7B9A' }}>Publikovat na</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePublishPlatform(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: selectedPublishPlatforms.includes(p) ? platformColors[p] + '20' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedPublishPlatforms.includes(p) ? platformColors[p] + '60' : 'rgba(255,255,255,0.06)'}`,
                    color: selectedPublishPlatforms.includes(p) ? platformColors[p] : '#7B7B9A',
                  }}
                >
                  {selectedPublishPlatforms.includes(p) && <CheckCircle size={10} />}
                  {p === 'instagram' ? 'IG' : p === 'linkedin' ? 'LI' : p === 'tiktok' ? 'TT' : p === 'facebook' ? 'FB' : 'YT'}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tags */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#7B7B9A' }}>Tagy</label>
              <div
                className="rounded-xl p-3 min-h-[80px]"
                style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(107,91,255,0.15)', color: '#6B5BFF' }}
                    >
                      #{t}
                      <button onClick={() => setTags(tags.filter(x => x !== t))}>
                        <X size={9} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="+ přidat tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  className="bg-transparent text-xs outline-none w-full"
                  style={{ color: '#F0F0FF' }}
                />
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#7B7B9A' }}>Naplánovat</label>
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} style={{ color: '#7B7B9A' }} />
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="bg-transparent text-xs outline-none flex-1"
                    style={{ color: '#F0F0FF', colorScheme: 'dark' }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} style={{ color: '#7B7B9A' }} />
                  <select
                    className="bg-transparent text-xs outline-none flex-1"
                    style={{ color: '#F0F0FF' }}
                  >
                    <option value="filip" style={{ backgroundColor: '#16162A' }}>Filip D.</option>
                    <option value="jana" style={{ backgroundColor: '#16162A' }}>Jana N.</option>
                    <option value="martin" style={{ backgroundColor: '#16162A' }}>Martin K.</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#7B7B9A' }}>Kampaň</label>
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <select className="bg-transparent text-sm outline-none flex-1" style={{ color: '#F0F0FF' }}>
                <option style={{ backgroundColor: '#16162A' }}>Q1 2026 – Jarní investice</option>
                <option style={{ backgroundColor: '#16162A' }}>Brand Awareness Q2</option>
                <option style={{ backgroundColor: '#16162A' }}>LinkedIn B2B série</option>
                <option style={{ backgroundColor: '#16162A' }}>— bez kampaně —</option>
              </select>
              <ChevronDown size={14} style={{ color: '#7B7B9A' }} />
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div
          className="flex gap-3 px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#7B7B9A' }}
          >
            Uložit draft
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(107,91,255,0.15)', border: '1px solid rgba(107,91,255,0.3)', color: '#6B5BFF' }}
          >
            Naplánovat
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: publishing ? 'rgba(107,91,255,0.3)' : 'linear-gradient(135deg, #6B5BFF, #5A4BEE)',
              color: '#fff',
              opacity: publishing ? 0.8 : 1,
            }}
          >
            {publishing ? 'Publikuji...' : 'Publikovat nyní'}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL – Preview */}
      <div className="flex flex-col overflow-hidden" style={{ width: '45%', backgroundColor: '#080810' }}>
        {/* Preview header */}
        <div
          className="px-6 pt-6 pb-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF' }}>Náhled</h2>
            <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>Jak bude příspěvek vypadat</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setPreviewMode('mobile')}
              className="p-1.5 rounded-md transition-all"
              style={{ backgroundColor: previewMode === 'mobile' ? 'rgba(107,91,255,0.2)' : 'transparent', color: previewMode === 'mobile' ? '#6B5BFF' : '#7B7B9A' }}
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className="p-1.5 rounded-md transition-all"
              style={{ backgroundColor: previewMode === 'desktop' ? 'rgba(107,91,255,0.2)' : 'transparent', color: previewMode === 'desktop' ? '#6B5BFF' : '#7B7B9A' }}
            >
              <Monitor size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Instagram Mobile Preview */}
          {activePlatform === 'instagram' && previewMode === 'mobile' && (
            <div className="flex justify-center">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  width: 320,
                  border: '8px solid #1A1A2E',
                  boxShadow: '0 0 40px rgba(0,0,0,0.6)',
                }}
              >
                {/* Instagram UI */}
                <div style={{ backgroundColor: '#1A1A1A' }}>
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #6B5BFF, #E1306C)' }} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: '#fff' }}>oneflow.cz</p>
                      <p className="text-[10px]" style={{ color: '#999' }}>Praha, Czech Republic</p>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#3897f0' }}>Sledovat</span>
                  </div>
                  {/* Image placeholder or real image */}
                  <div
                    className="flex items-center justify-center overflow-hidden"
                    style={{ height: 300, background: 'linear-gradient(135deg, rgba(107,91,255,0.3), rgba(0,217,255,0.2))' }}
                  >
                    {mediaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl} alt="Media" className="w-full h-full object-cover" />
                    ) : (
                      <Wand2 size={40} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    )}
                  </div>
                  {/* Actions */}
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ color: '#fff', fontSize: 18 }}>♡</span>
                      <span style={{ color: '#fff', fontSize: 18 }}>💬</span>
                      <span style={{ color: '#fff', fontSize: 18 }}>✈️</span>
                    </div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#fff' }}>1 234 To se mi líbí</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#eee' }}>
                      <span className="font-semibold">oneflow.cz</span>{' '}
                      {content.slice(0, 120)}
                      {content.length > 120 && <span style={{ color: '#999' }}>... více</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {activePlatform === 'linkedin' && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1B1B2E', maxWidth: 550 }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #6B5BFF, #0A66C2)' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>Filip Dopita</p>
                    <p className="text-xs" style={{ color: '#7B7B9A' }}>Founder at OneFlow • Investiční platforma</p>
                    <p className="text-xs" style={{ color: '#7B7B9A' }}>2 hod • 🌐</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#F0F0FF' }}>
                  {content.slice(0, 400)}{content.length > 400 && '...'}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {['👍 Líbí se mi', '💬 Komentář', '🔄 Sdílet', '✈️ Odeslat'].map((a) => (
                    <button key={a} className="text-xs" style={{ color: '#7B7B9A' }}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TikTok Preview */}
          {activePlatform === 'tiktok' && previewMode === 'mobile' && (
            <div className="flex justify-center">
              <div
                className="rounded-3xl overflow-hidden relative"
                style={{
                  width: 280,
                  height: 500,
                  border: '8px solid #1A1A2E',
                  background: 'linear-gradient(180deg, rgba(0,217,255,0.1) 0%, #000 50%)',
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#fff' }}>@oneflow.cz</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#eee' }}>
                    {content.slice(0, 100)}...
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#aaa' }}>♫ Originální zvuk</p>
                </div>
                <div className="absolute right-3 bottom-20 flex flex-col gap-4">
                  {['♡', '💬', '↗', '⋯'].map((icon) => (
                    <div key={icon} className="flex flex-col items-center">
                      <span style={{ fontSize: 22, color: '#fff' }}>{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Facebook / YouTube / other */}
          {(activePlatform === 'facebook' || activePlatform === 'youtube') && (
            <div
              className="rounded-xl p-5"
              style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1B1B2E', maxWidth: 550 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full" style={{ background: activePlatform === 'facebook' ? 'linear-gradient(135deg, #1877F2, #6B5BFF)' : 'linear-gradient(135deg, #FF4444, #FFB800)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>OneFlow</p>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>Právě teď</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#F0F0FF' }}>{content.slice(0, 300)}{content.length > 300 && '...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
