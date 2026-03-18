'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, Target, TrendingUp, CheckCircle, Clock, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'completed' | 'draft' | 'paused'
  startDate: string
  endDate: string
  platforms: string[]
  totalPosts: number
  publishedPosts: number
  reach: number
  engagement: number
  color: string
  brief: string
  goal: string
}

const campaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Q1 2026 – Jarní investice',
    status: 'active',
    startDate: '1.3.2026',
    endDate: '31.3.2026',
    platforms: ['instagram', 'linkedin', 'tiktok'],
    totalPosts: 24,
    publishedPosts: 18,
    reach: 142800,
    engagement: 5.8,
    color: '#6B5BFF',
    brief: 'Kampaň zaměřená na jarní poptávku po investičních produktech. Cíl je zvýšit brand awareness a generovat leady přes social media.',
    goal: 'Zvýšit počet registrací o 30%',
  },
  {
    id: 'c2',
    name: 'LinkedIn B2B Série',
    status: 'active',
    startDate: '10.3.2026',
    endDate: '10.4.2026',
    platforms: ['linkedin'],
    totalPosts: 12,
    publishedPosts: 4,
    reach: 48200,
    engagement: 7.2,
    color: '#0A66C2',
    brief: 'Edukativní série pro B2B segment – founders, CFO a finanční ředitelé. 12 příspěvků o cash flow, investicích a financování firem.',
    goal: 'Oslovit 50+ B2B rozhodovatelů',
  },
  {
    id: 'c3',
    name: 'TikTok Virální Obsah',
    status: 'active',
    startDate: '15.3.2026',
    endDate: '15.4.2026',
    platforms: ['tiktok', 'instagram'],
    totalPosts: 20,
    publishedPosts: 6,
    reach: 218400,
    engagement: 8.1,
    color: '#00D9FF',
    brief: 'Virální obsah na TikTok zaměřený na mladší investory (25-35 let). Edu-tainment formát – finanční vzdělávání v zábavné formě.',
    goal: '1M+ views celkem',
  },
  {
    id: 'c4',
    name: 'Webinář – Pasivní příjem',
    status: 'completed',
    startDate: '1.2.2026',
    endDate: '28.2.2026',
    platforms: ['facebook', 'instagram', 'linkedin'],
    totalPosts: 16,
    publishedPosts: 16,
    reach: 89400,
    engagement: 4.3,
    color: '#00E5A0',
    brief: 'Propagační kampaň pro webinář "Pasivní příjem v roce 2026". Cílem bylo získat 200+ registrací.',
    goal: '200+ registrací na webinář',
  },
  {
    id: 'c5',
    name: 'Brand Awareness Q2',
    status: 'draft',
    startDate: '1.4.2026',
    endDate: '30.6.2026',
    platforms: ['instagram', 'youtube', 'linkedin', 'facebook'],
    totalPosts: 48,
    publishedPosts: 0,
    reach: 0,
    engagement: 0,
    color: '#FFB800',
    brief: 'Plánovaná kampaň na Q2 2026 pro zvýšení brand awareness. Zahrnuje video obsah, Stories, a LinkedIn Articles.',
    goal: 'Zdvojnásobit follower base',
  },
]

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: '#00E5A0', bg: 'rgba(0,229,160,0.15)', label: 'Aktivní' },
  completed: { color: '#6B5BFF', bg: 'rgba(107,91,255,0.15)', label: 'Dokončeno' },
  draft: { color: '#FFB800', bg: 'rgba(255,184,0,0.15)', label: 'Draft' },
  paused: { color: '#7B7B9A', bg: 'rgba(123,123,154,0.15)', label: 'Pozastaveno' },
}

const platformColors: Record<string, string> = {
  instagram: '#E1306C', linkedin: '#0A66C2', tiktok: '#00D9FF',
  facebook: '#1877F2', youtube: '#FF4444', pinterest: '#E60023',
}

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0])

  const analyticsData = [
    { date: 'T1', reach: 12000, engagement: 520 },
    { date: 'T2', reach: 18400, engagement: 890 },
    { date: 'T3', reach: 24800, engagement: 1120 },
    { date: 'T4', reach: 31200, engagement: 1480 },
    { date: 'T5', reach: 28900, engagement: 1210 },
    { date: 'T6', reach: 42100, engagement: 2100 },
    { date: 'T7', reach: 38400, engagement: 1820 },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Kampaně</h1>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Správa a analýza obsahu kampaní</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
        >
          <Plus size={16} />
          Nová kampaň
        </button>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Campaign List */}
        <div className="col-span-4 space-y-3">
          {campaigns.map((c, i) => {
            const progress = c.totalPosts > 0 ? (c.publishedPosts / c.totalPosts) * 100 : 0
            const st = statusConfig[c.status]
            const isSelected = selectedCampaign?.id === c.id

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedCampaign(c)}
                className="p-4 rounded-2xl cursor-pointer transition-all premium-card"
                style={{
                  backgroundColor: isSelected ? `${c.color}10` : '#0F0F1A',
                  border: `1px solid ${isSelected ? c.color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F0F0FF' }}>{c.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={10} style={{ color: '#7B7B9A' }} />
                      <span className="text-[10px]" style={{ color: '#7B7B9A' }}>{c.startDate} – {c.endDate}</span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: st.bg, color: st.color }}
                  >
                    {st.label}
                  </span>
                </div>

                {/* Platform icons */}
                <div className="flex items-center gap-1 mb-3">
                  {c.platforms.map(p => (
                    <span
                      key={p}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: `${platformColors[p]}15`, color: platformColors[p] }}
                    >
                      {p.slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span style={{ color: '#7B7B9A' }}>{c.publishedPosts}/{c.totalPosts} příspěvků</span>
                    <span style={{ color: c.color }}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Campaign Detail */}
        <AnimatePresence mode="wait">
          {selectedCampaign && (
            <motion.div
              key={selectedCampaign.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="col-span-8 space-y-5"
            >
              {/* Campaign Header */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${selectedCampaign.color}12, rgba(0,0,0,0))`,
                  border: `1px solid ${selectedCampaign.color}25`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>{selectedCampaign.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full`} style={{ backgroundColor: statusConfig[selectedCampaign.status].bg, color: statusConfig[selectedCampaign.status].color }}>
                        {statusConfig[selectedCampaign.status].label}
                      </span>
                      <span className="text-xs" style={{ color: '#7B7B9A' }}>{selectedCampaign.startDate} – {selectedCampaign.endDate}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7B7B9A' }}>{selectedCampaign.brief}</p>
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <Target size={14} style={{ color: selectedCampaign.color }} />
                  <span className="text-sm font-medium" style={{ color: '#F0F0FF' }}>Cíl: {selectedCampaign.goal}</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Dosah', value: selectedCampaign.reach > 0 ? selectedCampaign.reach.toLocaleString() : '—', icon: TrendingUp, color: '#6B5BFF' },
                  { label: 'Engagement', value: selectedCampaign.engagement > 0 ? `${selectedCampaign.engagement}%` : '—', icon: CheckCircle, color: '#00E5A0' },
                  { label: 'Publikováno', value: `${selectedCampaign.publishedPosts}/${selectedCampaign.totalPosts}`, icon: Clock, color: selectedCampaign.color },
                  { label: 'Platformy', value: selectedCampaign.platforms.length.toString(), icon: Target, color: '#FFB800' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs" style={{ color: '#7B7B9A' }}>{s.label}</p>
                      <s.icon size={14} style={{ color: s.color }} />
                    </div>
                    <p className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div
                className="p-5 rounded-2xl"
                style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#F0F0FF' }}>Časová osa</h3>
                <div className="relative">
                  <div className="h-2 rounded-full w-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(selectedCampaign.publishedPosts / selectedCampaign.totalPosts) * 100}%`,
                        backgroundColor: selectedCampaign.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span style={{ color: '#7B7B9A' }}>{selectedCampaign.startDate}</span>
                    <span style={{ color: selectedCampaign.color }}>
                      {Math.round((selectedCampaign.publishedPosts / selectedCampaign.totalPosts) * 100)}% hotovo
                    </span>
                    <span style={{ color: '#7B7B9A' }}>{selectedCampaign.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Analytics Chart */}
              {selectedCampaign.reach > 0 && (
                <div
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <h3 className="text-sm font-semibold mb-4" style={{ color: '#F0F0FF' }}>Výkon kampaně (dosah)</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={analyticsData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" tick={{ fill: '#7B7B9A', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#7B7B9A', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Bar dataKey="reach" fill={selectedCampaign.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
