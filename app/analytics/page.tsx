'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Eye, Heart, Link, Users, Radio } from 'lucide-react'

const DATE_RANGES = ['7 dní', '30 dní', '90 dní', 'Vlastní']
const PLATFORM_TABS = ['Všechny', 'Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'YouTube']

const reachData = [
  { date: '1.3', instagram: 8200, linkedin: 4100, tiktok: 18400, facebook: 3200, youtube: 2100 },
  { date: '3.3', instagram: 9400, linkedin: 3800, tiktok: 21000, facebook: 2900, youtube: 1800 },
  { date: '5.3', instagram: 7800, linkedin: 5200, tiktok: 19200, facebook: 3500, youtube: 2400 },
  { date: '7.3', instagram: 11200, linkedin: 6100, tiktok: 24800, facebook: 4100, youtube: 2900 },
  { date: '9.3', instagram: 10500, linkedin: 5700, tiktok: 22100, facebook: 3800, youtube: 2600 },
  { date: '11.3', instagram: 12800, linkedin: 7200, tiktok: 28900, facebook: 4600, youtube: 3200 },
  { date: '13.3', instagram: 11400, linkedin: 6800, tiktok: 25400, facebook: 4200, youtube: 2800 },
  { date: '15.3', instagram: 13900, linkedin: 8100, tiktok: 31200, facebook: 5100, youtube: 3600 },
  { date: '17.3', instagram: 14200, linkedin: 7900, tiktok: 29800, facebook: 4900, youtube: 3400 },
  { date: '18.3', instagram: 13100, linkedin: 8400, tiktok: 32100, facebook: 5200, youtube: 3800 },
]

const platformBarData = [
  { platform: 'Instagram', reach: 124800, engagement: 4.8, posts: 24 },
  { platform: 'LinkedIn', reach: 87200, engagement: 5.2, posts: 18 },
  { platform: 'TikTok', reach: 312000, engagement: 6.4, posts: 31 },
  { platform: 'Facebook', reach: 64100, engagement: 2.1, posts: 15 },
  { platform: 'YouTube', reach: 48700, engagement: 3.9, posts: 8 },
]

const topPosts = [
  {
    platform: 'tiktok', text: 'POV: Tvoje investice roste 12% ročně bez stresu...', date: '15.3.2026',
    reach: 42800, engagement: 8.3, ctr: 3.2, score: 94,
    scoreColor: '#00E5A0',
  },
  {
    platform: 'linkedin', text: '5 věcí, které každý founder musí vědět o cash flow...', date: '12.3.2026',
    reach: 18400, engagement: 7.1, ctr: 8.3, score: 91,
    scoreColor: '#00E5A0',
  },
  {
    platform: 'instagram', text: 'Investice jsou maraton, ne sprint – chraň svůj kapitál...', date: '10.3.2026',
    reach: 14200, engagement: 5.8, ctr: 2.4, score: 82,
    scoreColor: '#6B5BFF',
  },
]

const contentTable = [
  { platform: 'tiktok', text: 'POV: Investice 12%', date: '15.3.', reach: 42800, eng: 8.3, ctr: 3.2, score: 94 },
  { platform: 'linkedin', text: 'Cash flow pro foundery', date: '12.3.', reach: 18400, eng: 7.1, ctr: 8.3, score: 91 },
  { platform: 'instagram', text: 'Investice maraton', date: '10.3.', reach: 14200, eng: 5.8, ctr: 2.4, score: 82 },
  { platform: 'facebook', text: 'Webinář – registrace', date: '8.3.', reach: 8900, eng: 3.2, ctr: 4.1, score: 74 },
  { platform: 'tiktok', text: 'Složené úročení', date: '5.3.', reach: 31200, eng: 6.9, ctr: 2.8, score: 88 },
  { platform: 'youtube', text: 'OneFlow Behind Scenes', date: '3.3.', reach: 6400, eng: 4.2, ctr: 5.1, score: 71 },
  { platform: 'instagram', text: 'Infografika: DIP', date: '1.3.', reach: 11800, eng: 5.1, ctr: 1.9, score: 79 },
]

const platformColors: Record<string, string> = {
  tiktok: '#00D9FF', linkedin: '#0A66C2', instagram: '#E1306C',
  facebook: '#1877F2', youtube: '#FF4444', pinterest: '#E60023',
}

const DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const HOURS = ['0', '3', '6', '9', '12', '15', '18', '21']

const heatmapData = DAYS.map(() => HOURS.map(() => Math.random()))

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl" style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-xs font-medium mb-2" style={{ color: '#7B7B9A' }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface OverviewData {
  facebook: { insights?: { data?: unknown[] }; posts?: unknown } | null
  instagram: { insights?: { data?: unknown[] }; media?: unknown } | null
  youtube: { channel?: { statistics?: { subscriberCount?: string; viewCount?: string } }; videos?: unknown[] } | null
  fetchedAt?: string
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30 dní')
  const [platformTab, setPlatformTab] = useState('Všechny')
  const [sortCol, setSortCol] = useState('score')
  const [isLiveData, setIsLiveData] = useState(false)
  const [liveKpis, setLiveKpis] = useState<null | { title: string; value: string; change: number; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; color: string }[]>(null)

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then(r => r.json())
      .then((data: OverviewData) => {
        // Try to extract real metrics from API response
        const ytSubs = data.youtube?.channel?.statistics?.subscriberCount
        const ytViews = data.youtube?.channel?.statistics?.viewCount
        const igInsights = data.instagram?.insights?.data
        const fbInsights = data.facebook?.insights?.data

        if (ytSubs || igInsights || fbInsights) {
          setIsLiveData(true)
          setLiveKpis([
            {
              title: 'YouTube odběratelé',
              value: ytSubs ? parseInt(ytSubs).toLocaleString('cs') : '–',
              change: 0,
              icon: Eye,
              color: '#FF4444',
            },
            {
              title: 'YouTube zhlédnutí',
              value: ytViews ? parseInt(ytViews).toLocaleString('cs') : '–',
              change: 0,
              icon: Users,
              color: '#FF4444',
            },
            {
              title: 'Instagram insights',
              value: igInsights ? `${igInsights.length} metrik` : '–',
              change: 0,
              icon: Heart,
              color: '#E1306C',
            },
            {
              title: 'Facebook insights',
              value: fbInsights ? `${fbInsights.length} metrik` : '–',
              change: 0,
              icon: Link,
              color: '#1877F2',
            },
          ])
        }
      })
      .catch(() => {
        // Keep demo data on error
      })

    // Poll every 60 seconds
    const interval = setInterval(() => {
      fetch('/api/analytics/overview').catch(() => {})
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const demoKpis = [
    { title: 'Celkový dosah', value: '312,480', change: 14.2, icon: Eye, color: '#6B5BFF' },
    { title: 'Engagement Rate', value: '4.72%', change: 8.3, icon: Heart, color: '#E1306C' },
    { title: 'Celkové imprese', value: '847,200', change: 22.1, icon: Users, color: '#00D9FF' },
    { title: 'Link kliky', value: '18,340', change: -3.4, icon: Link, color: '#00E5A0' },
  ]

  const kpis = liveKpis ?? demoKpis

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Analytics Hub</h1>
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: isLiveData ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isLiveData ? 'rgba(0,229,160,0.4)' : 'rgba(255,255,255,0.12)'}`,
                color: isLiveData ? '#00E5A0' : '#7B7B9A',
              }}
            >
              <Radio size={10} />
              {isLiveData ? 'Live data' : 'Demo'}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Detailní výkonnostní přehled</p>
        </div>
        <div className="flex items-center gap-3">
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: dateRange === r ? 'rgba(107,91,255,0.2)' : 'rgba(255,255,255,0.04)',
                color: dateRange === r ? '#6B5BFF' : '#7B7B9A',
                border: `1px solid ${dateRange === r ? 'rgba(107,91,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Platform tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex gap-2 mb-6">
        {PLATFORM_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setPlatformTab(t)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: platformTab === t ? '#6B5BFF' : 'rgba(255,255,255,0.04)',
              color: platformTab === t ? '#fff' : '#7B7B9A',
              border: `1px solid ${platformTab === t ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {t}
          </button>
        ))}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => {
          const isPos = k.change >= 0
          return (
            <motion.div
              key={k.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl premium-card"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium" style={{ color: '#7B7B9A' }}>{k.title}</p>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${k.color}15` }}>
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{k.value}</p>
              <div className="flex items-center gap-1">
                {isPos ? <TrendingUp size={13} style={{ color: '#00E5A0' }} /> : <TrendingDown size={13} style={{ color: '#FF4D6D' }} />}
                <span className="text-xs font-medium" style={{ color: isPos ? '#00E5A0' : '#FF4D6D' }}>
                  {isPos ? '+' : ''}{k.change}%
                </span>
                <span className="text-xs" style={{ color: '#7B7B9A' }}>vs. předchozí</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Dosah v čase</h2>
            <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>Unikátní dosah napříč platformami</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={reachData}>
            <defs>
              {[
                { id: 'ig', color: '#E1306C' },
                { id: 'li', color: '#0A66C2' },
                { id: 'tt', color: '#00D9FF' },
                { id: 'fb', color: '#1877F2' },
                { id: 'yt', color: '#FF4444' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="tiktok" stroke="#00D9FF" fill="url(#grad-tt)" strokeWidth={2} name="TikTok" />
            <Area type="monotone" dataKey="instagram" stroke="#E1306C" fill="url(#grad-ig)" strokeWidth={2} name="Instagram" />
            <Area type="monotone" dataKey="linkedin" stroke="#0A66C2" fill="url(#grad-li)" strokeWidth={2} name="LinkedIn" />
            <Area type="monotone" dataKey="facebook" stroke="#1877F2" fill="url(#grad-fb)" strokeWidth={2} name="Facebook" />
            <Area type="monotone" dataKey="youtube" stroke="#FF4444" fill="url(#grad-yt)" strokeWidth={2} name="YouTube" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Platform bar + Heatmap */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl"
          style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-lg font-semibold mb-5" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Platformy – porovnání</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformBarData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="platform" tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="reach" fill="#6B5BFF" radius={[4, 4, 0, 0]} name="Dosah" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl"
          style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Nejlepší časy pro publikování</h2>
          <p className="text-xs mb-5" style={{ color: '#7B7B9A' }}>Tmavší = vyšší engagement</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${HOURS.length}, 1fr)` }}>
            <div />
            {HOURS.map((h) => (
              <div key={h} className="text-center text-[9px]" style={{ color: '#7B7B9A' }}>{h}h</div>
            ))}
            {DAYS.map((d, di) => (
              <>
                <div key={`label-${d}`} className="text-[10px] flex items-center pr-1 font-medium" style={{ color: '#7B7B9A' }}>{d}</div>
                {HOURS.map((h, hi) => {
                  const val = heatmapData[di]?.[hi] ?? 0
                  return (
                    <div
                      key={`${d}-${h}`}
                      className="h-6 rounded-sm"
                      style={{
                        backgroundColor: `rgba(107, 91, 255, ${0.05 + val * 0.7})`,
                        border: '1px solid rgba(107,91,255,0.1)',
                      }}
                      title={`${d} ${h}h: ${Math.round(val * 100)}%`}
                    />
                  )
                })}
              </>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="text-lg font-semibold mb-5" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Výkon obsahu</h2>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Příspěvek', 'Platforma', 'Datum', 'Dosah', 'Engagement', 'CTR', 'Skóre'].map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-semibold uppercase tracking-wider pb-3 pr-4 cursor-pointer"
                  style={{ color: sortCol === col.toLowerCase() ? '#6B5BFF' : '#7B7B9A' }}
                  onClick={() => setSortCol(col.toLowerCase())}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contentTable.map((row, i) => (
              <tr key={i} className="group" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td className="py-3 pr-4">
                  <p className="text-sm truncate max-w-[180px]" style={{ color: '#F0F0FF' }}>{row.text}</p>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${platformColors[row.platform]}20`, color: platformColors[row.platform] }}
                  >
                    {row.platform.slice(0, 2).toUpperCase()}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm" style={{ color: '#7B7B9A' }}>{row.date}</td>
                <td className="py-3 pr-4 text-sm font-medium" style={{ color: '#F0F0FF' }}>{row.reach.toLocaleString()}</td>
                <td className="py-3 pr-4 text-sm" style={{ color: '#00E5A0' }}>{row.eng}%</td>
                <td className="py-3 pr-4 text-sm" style={{ color: '#00D9FF' }}>{row.ctr}%</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${row.score}%`, backgroundColor: row.score > 85 ? '#00E5A0' : '#6B5BFF' }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: row.score > 85 ? '#00E5A0' : '#6B5BFF' }}>{row.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Top Posts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h2 className="text-lg font-semibold mb-5" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Top příspěvky</h2>
        <div className="grid grid-cols-3 gap-4">
          {topPosts.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-2xl cursor-pointer premium-card"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${platformColors[p.platform]}20`, color: platformColors[p.platform] }}
                >
                  {p.platform.toUpperCase().slice(0, 2)}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${p.scoreColor}20`, color: p.scoreColor }}
                >
                  Score {p.score}
                </span>
              </div>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#F0F0FF' }}>{p.text}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>Dosah</p>
                  <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>{p.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>Eng.</p>
                  <p className="text-sm font-semibold" style={{ color: '#00E5A0' }}>{p.engagement}%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>CTR</p>
                  <p className="text-sm font-semibold" style={{ color: '#00D9FF' }}>{p.ctr}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
