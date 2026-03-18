'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid3X3, List, Search, Upload, FolderOpen, X, Image, Video, FileText, Link2 } from 'lucide-react'

const FILTERS = ['Vše', 'Obrázky', 'Videa', 'Dokumenty', 'Z Drive']

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  platforms: string[]
  usedIn: number
  color: string
  fromDrive: boolean
  date: string
}

const assets: Asset[] = [
  { id: 'a1', name: 'oneflow-hero-bg.png', type: 'image', size: '2.4 MB', platforms: ['instagram', 'facebook'], usedIn: 8, color: 'from-purple-600 to-blue-600', fromDrive: false, date: '15.3.2026' },
  { id: 'a2', name: 'investice-infografika.png', type: 'image', size: '1.8 MB', platforms: ['instagram', 'linkedin'], usedIn: 5, color: 'from-pink-600 to-purple-600', fromDrive: true, date: '14.3.2026' },
  { id: 'a3', name: 'tiktok-intro-video.mp4', type: 'video', size: '18.2 MB', platforms: ['tiktok', 'youtube'], usedIn: 3, color: 'from-cyan-600 to-blue-600', fromDrive: false, date: '12.3.2026' },
  { id: 'a4', name: 'oneflow-brand-guide.pdf', type: 'document', size: '4.1 MB', platforms: [], usedIn: 0, color: 'from-indigo-600 to-purple-600', fromDrive: true, date: '10.3.2026' },
  { id: 'a5', name: 'linkedin-banner-2026.png', type: 'image', size: '0.9 MB', platforms: ['linkedin'], usedIn: 2, color: 'from-blue-600 to-indigo-600', fromDrive: false, date: '9.3.2026' },
  { id: 'a6', name: 'webinar-promo-short.mp4', type: 'video', size: '24.6 MB', platforms: ['instagram', 'facebook', 'tiktok'], usedIn: 7, color: 'from-emerald-600 to-cyan-600', fromDrive: false, date: '8.3.2026' },
  { id: 'a7', name: 'casestudy-jan-petr.png', type: 'image', size: '3.2 MB', platforms: ['instagram', 'linkedin'], usedIn: 4, color: 'from-rose-600 to-pink-600', fromDrive: true, date: '7.3.2026' },
  { id: 'a8', name: 'q1-results-report.pdf', type: 'document', size: '1.2 MB', platforms: ['linkedin'], usedIn: 1, color: 'from-amber-600 to-orange-600', fromDrive: true, date: '5.3.2026' },
  { id: 'a9', name: 'background-pattern.png', type: 'image', size: '0.4 MB', platforms: ['instagram', 'facebook', 'pinterest'], usedIn: 12, color: 'from-violet-600 to-purple-600', fromDrive: false, date: '4.3.2026' },
  { id: 'a10', name: 'explainer-video.mp4', type: 'video', size: '42.1 MB', platforms: ['youtube'], usedIn: 2, color: 'from-red-600 to-rose-600', fromDrive: false, date: '3.3.2026' },
  { id: 'a11', name: 'team-photo.jpg', type: 'image', size: '5.8 MB', platforms: ['instagram', 'linkedin', 'facebook'], usedIn: 6, color: 'from-teal-600 to-green-600', fromDrive: false, date: '1.3.2026' },
  { id: 'a12', name: 'content-calendar-template.pdf', type: 'document', size: '0.8 MB', platforms: [], usedIn: 0, color: 'from-orange-600 to-amber-600', fromDrive: true, date: '28.2.2026' },
]

const platformColors: Record<string, string> = {
  instagram: '#E1306C', linkedin: '#0A66C2', tiktok: '#00D9FF',
  facebook: '#1877F2', youtube: '#FF4444', pinterest: '#E60023',
}

const typeIcon = (type: string) => {
  if (type === 'image') return <Image size={16} />
  if (type === 'video') return <Video size={16} />
  return <FileText size={16} />
}

const typeColor = (type: string) => {
  if (type === 'image') return '#6B5BFF'
  if (type === 'video') return '#00D9FF'
  return '#FFB800'
}

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('Vše')
  const [search, setSearch] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const filtered = assets.filter(a => {
    const matchesFilter =
      filter === 'Vše' ||
      (filter === 'Obrázky' && a.type === 'image') ||
      (filter === 'Videa' && a.type === 'video') ||
      (filter === 'Dokumenty' && a.type === 'document') ||
      (filter === 'Z Drive' && a.fromDrive)
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Media Library</h1>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>{assets.length} souborů · {assets.reduce((s, a) => s + parseFloat(a.size), 0).toFixed(1)} MB celkem</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, rgba(0,217,255,0.1), rgba(107,91,255,0.1))',
              border: '1px solid rgba(0,217,255,0.2)',
              color: '#00D9FF',
            }}
          >
            <Link2 size={15} />
            Připojit Google Drive
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
          >
            <Upload size={15} />
            Nahrát soubory
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', width: 260 }}
          >
            <Search size={15} style={{ color: '#7B7B9A' }} />
            <input
              type="text"
              placeholder="Hledat soubory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: '#F0F0FF' }}
            />
          </div>

          {/* Filters */}
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filter === f ? 'rgba(107,91,255,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#6B5BFF' : '#7B7B9A',
                border: `1px solid ${filter === f ? 'rgba(107,91,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="p-1.5 rounded-md transition-all"
            style={{ backgroundColor: viewMode === 'grid' ? 'rgba(107,91,255,0.2)' : 'transparent', color: viewMode === 'grid' ? '#6B5BFF' : '#7B7B9A' }}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-1.5 rounded-md transition-all"
            style={{ backgroundColor: viewMode === 'list' ? 'rgba(107,91,255,0.2)' : 'transparent', color: viewMode === 'list' ? '#6B5BFF' : '#7B7B9A' }}
          >
            <List size={16} />
          </button>
        </div>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6 p-5 rounded-2xl flex items-center gap-4"
        style={{ border: '1px dashed rgba(107,91,255,0.3)', backgroundColor: 'rgba(107,91,255,0.03)' }}
      >
        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(107,91,255,0.1)' }}>
          <Upload size={20} style={{ color: '#6B5BFF' }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: '#F0F0FF' }}>Přetáhněte soubory sem</p>
          <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>PNG, JPG, MP4, PDF, GIF — max 500MB</p>
        </div>
      </motion.div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedAsset(asset)}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Thumbnail */}
              <div
                className={`h-40 flex items-center justify-center bg-gradient-to-br ${asset.color}`}
                style={{ opacity: 0.7 }}
              >
                <span style={{ color: 'rgba(255,255,255,0.6)', transform: 'scale(2)' }}>
                  {typeIcon(asset.type)}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate mb-1" style={{ color: '#F0F0FF' }}>{asset.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: '#7B7B9A' }}>{asset.size}</span>
                  {asset.fromDrive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'rgba(0,217,255,0.1)', color: '#00D9FF' }}>Drive</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {asset.platforms.slice(0, 3).map(p => (
                    <span
                      key={p}
                      className="text-[9px] font-bold px-1 py-0.5 rounded"
                      style={{ backgroundColor: `${platformColors[p]}15`, color: platformColors[p] }}
                    >
                      {p.slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                  {asset.usedIn > 0 && (
                    <span className="ml-auto text-[10px]" style={{ color: '#7B7B9A' }}>použito {asset.usedIn}×</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0F0F1A' }}>
                {['Název', 'Typ', 'Velikost', 'Platformy', 'Použito', 'Datum'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-3 px-4" style={{ color: '#7B7B9A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset, i) => (
                <motion.tr
                  key={asset.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedAsset(asset)}
                  className="cursor-pointer group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', backgroundColor: i % 2 === 0 ? '#0F0F1A' : 'rgba(255,255,255,0.01)' }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${asset.color}`}>
                        <span style={{ color: 'rgba(255,255,255,0.9)' }}>{typeIcon(asset.type)}</span>
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#F0F0FF' }}>{asset.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${typeColor(asset.type)}15`, color: typeColor(asset.type) }}
                    >
                      {asset.type === 'image' ? 'Obrázek' : asset.type === 'video' ? 'Video' : 'Dokument'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: '#7B7B9A' }}>{asset.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {asset.platforms.slice(0, 4).map(p => (
                        <span
                          key={p}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ backgroundColor: `${platformColors[p]}15`, color: platformColors[p] }}
                        >
                          {p.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: '#7B7B9A' }}>{asset.usedIn}×</td>
                  <td className="py-3 px-4 text-sm" style={{ color: '#7B7B9A' }}>{asset.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSelectedAsset(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="pointer-events-auto rounded-2xl p-6 w-[480px]"
                style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: '#F0F0FF' }}>{selectedAsset.name}</h3>
                  <button onClick={() => setSelectedAsset(null)}>
                    <X size={18} style={{ color: '#7B7B9A' }} />
                  </button>
                </div>
                <div
                  className={`h-48 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${selectedAsset.color}`}
                >
                  <span style={{ color: 'rgba(255,255,255,0.6)', transform: 'scale(3)' }}>{typeIcon(selectedAsset.type)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Typ', value: selectedAsset.type },
                    { label: 'Velikost', value: selectedAsset.size },
                    { label: 'Přidáno', value: selectedAsset.date },
                    { label: 'Použito celkem', value: `${selectedAsset.usedIn}× v příspěvcích` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: '#16162A' }}>
                      <p className="text-xs" style={{ color: '#7B7B9A' }}>{label}</p>
                      <p className="text-sm font-medium mt-0.5 capitalize" style={{ color: '#F0F0FF' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#F0F0FF' }}
                  >
                    Stáhnout
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
                  >
                    Použít v příspěvku
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
