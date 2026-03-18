'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import PlatformBadge from '@/components/ui/PlatformBadge'

const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube', 'pinterest']

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  tiktok: '#00D9FF',
  facebook: '#1877F2',
  youtube: '#FF4444',
  pinterest: '#E60023',
}

interface Post {
  id: string
  platform: string
  text: string
  time: string
}

const demoPostsByDay: Record<number, Post[]> = {
  1: [
    { id: 'p1', platform: 'instagram', text: 'Investice jako životní styl', time: '09:00' },
    { id: 'p2', platform: 'linkedin', text: 'B2B finanční poradenství', time: '11:00' },
  ],
  3: [
    { id: 'p3', platform: 'tiktok', text: 'POV: Pasivní příjem 12%', time: '15:00' },
    { id: 'p4', platform: 'facebook', text: 'Webinář zdarma – registrace', time: '10:00' },
    { id: 'p5', platform: 'youtube', text: 'OneFlow Behind the Scenes', time: '18:00' },
  ],
  5: [
    { id: 'p6', platform: 'instagram', text: 'Case study: Jan P. a jeho výnos', time: '08:00' },
  ],
  7: [
    { id: 'p7', platform: 'linkedin', text: 'Trendy v českém fintech sektoru', time: '09:30' },
    { id: 'p8', platform: 'pinterest', text: 'Investiční vizuál – moodboard', time: '12:00' },
  ],
  10: [
    { id: 'p9', platform: 'instagram', text: 'Behind the scenes – OneFlow team', time: '10:00' },
    { id: 'p10', platform: 'tiktok', text: 'Vysvětluji DIP jednoduše', time: '16:00' },
    { id: 'p11', platform: 'facebook', text: 'Sledujte nás na Instagramu', time: '11:00' },
  ],
  12: [
    { id: 'p12', platform: 'youtube', text: 'Rozhovor s investorem – celý díl', time: '18:00' },
    { id: 'p13', platform: 'linkedin', text: 'Výsledky Q1 2026 – OneFlow', time: '09:00' },
  ],
  14: [
    { id: 'p14', platform: 'instagram', text: 'Motivační citát – víkend', time: '08:30' },
  ],
  16: [
    { id: 'p15', platform: 'tiktok', text: 'Investiční quiz – otestuj se!', time: '14:00' },
    { id: 'p16', platform: 'linkedin', text: 'Jak vybrat správný investiční fond', time: '10:00' },
  ],
  18: [
    { id: 'p17', platform: 'instagram', text: 'Reel: Cesta k finanční svobodě', time: '09:00' },
    { id: 'p18', platform: 'facebook', text: 'Webinář zítřek – připomenutí', time: '15:00' },
    { id: 'p19', platform: 'youtube', text: 'Shorts: 3 mýty o investicích', time: '12:00' },
  ],
  20: [
    { id: 'p20', platform: 'pinterest', text: 'Board: Česká architektura & finance', time: '11:00' },
    { id: 'p21', platform: 'linkedin', text: 'Partnership announcement – nový fond', time: '09:30' },
  ],
  21: [
    { id: 'p22', platform: 'instagram', text: 'Story poll: Co tě zajímá?', time: '18:00' },
  ],
  23: [
    { id: 'p23', platform: 'tiktok', text: 'Trend audit – co letí na TT', time: '16:00' },
    { id: 'p24', platform: 'facebook', text: 'Sdílej a vyhraj konzultaci', time: '10:00' },
  ],
  25: [
    { id: 'p25', platform: 'youtube', text: 'Video: Jak funguje OneFlow?', time: '18:00' },
    { id: 'p26', platform: 'linkedin', text: 'Únorové výsledky trhů – analýza', time: '09:00' },
    { id: 'p27', platform: 'instagram', text: 'Infografika: Složené úročení', time: '12:00' },
  ],
  27: [
    { id: 'p28', platform: 'instagram', text: 'Víkendová inspirace – portfolio', time: '10:00' },
  ],
  28: [
    { id: 'p29', platform: 'linkedin', text: 'Nový fond dostupný od dubna', time: '11:00' },
    { id: 'p30', platform: 'tiktok', text: 'Reakční video na finanční mýty', time: '15:00' },
  ],
}

const DAYS_OF_WEEK = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const MONTHS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']

type View = 'month' | 'week' | 'day' | 'list'

export default function CalendarPage() {
  const [view, setView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)) // March 2026
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set(PLATFORMS))
  const today = new Date(2026, 2, 18) // March 18, 2026

  const togglePlatform = (p: string) => {
    const next = new Set(activePlatforms)
    if (next.has(p)) next.delete(p)
    else next.add(p)
    setActivePlatforms(next)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const firstDayAdj = (firstDay + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstDayAdj + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDayAdj + 1
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null
  })

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Content Calendar</h1>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Plánujte a spravujte obsah napříč platformami</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
        >
          <Plus size={16} />
          Přidat příspěvek
        </button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        {/* Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-2 rounded-lg transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#7B7B9A' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-xl font-semibold min-w-[160px] text-center" style={{ color: '#F0F0FF' }}>
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-2 rounded-lg transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#7B7B9A' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Platform filters */}
        <div className="flex items-center gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: activePlatforms.has(p) ? `${platformColors[p]}20` : 'rgba(255,255,255,0.04)',
                color: activePlatforms.has(p) ? platformColors[p] : '#7B7B9A',
                border: `1px solid ${activePlatforms.has(p) ? platformColors[p] + '40' : 'rgba(255,255,255,0.06)'}`,
                opacity: activePlatforms.has(p) ? 1 : 0.5,
              }}
            >
              {p.slice(0, 2).toUpperCase()}
            </button>
          ))}
        </div>

        {/* View switcher */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {(['month', 'week', 'day', 'list'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-2 text-sm font-medium capitalize transition-all"
              style={{
                backgroundColor: view === v ? 'rgba(107,91,255,0.2)' : 'rgba(255,255,255,0.03)',
                color: view === v ? '#6B5BFF' : '#7B7B9A',
              }}
            >
              {v === 'month' ? 'Měsíc' : v === 'week' ? 'Týden' : v === 'day' ? 'Den' : 'Seznam'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0F0F1A' }}
      >
        {/* Day headers */}
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#7B7B9A' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const posts = day ? (demoPostsByDay[day] || []).filter(p => activePlatforms.has(p.platform)) : []
            const isLastRow = idx >= cells.length - 7

            return (
              <div
                key={idx}
                className="group relative min-h-[110px] p-2 transition-all"
                style={{
                  borderRight: (idx + 1) % 7 !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  borderBottom: !isLastRow ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  backgroundColor: isToday ? 'rgba(107,91,255,0.05)' : 'transparent',
                }}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: isToday ? '#6B5BFF' : 'transparent',
                          color: isToday ? '#fff' : '#7B7B9A',
                          boxShadow: isToday ? '0 0 12px rgba(107,91,255,0.5)' : 'none',
                        }}
                      >
                        {day}
                      </span>
                      <button
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md transition-all"
                        style={{ backgroundColor: 'rgba(107,91,255,0.2)', color: '#6B5BFF' }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {posts.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md cursor-pointer text-[10px] font-medium truncate transition-all"
                          style={{
                            backgroundColor: `${platformColors[post.platform]}15`,
                            color: platformColors[post.platform],
                            border: `1px solid ${platformColors[post.platform]}30`,
                          }}
                        >
                          <span className="font-bold flex-shrink-0">{post.platform.slice(0, 2).toUpperCase()}</span>
                          <span className="truncate" style={{ color: '#F0F0FF' }}>{post.text.slice(0, 18)}</span>
                        </div>
                      ))}
                      {posts.length > 3 && (
                        <p className="text-[10px] px-1" style={{ color: '#7B7B9A' }}>+{posts.length - 3} více</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
