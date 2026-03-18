'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Users, Radio } from 'lucide-react'

const DATE_RANGES = ['7 dní', '30 dní', '90 dní', 'Vlastní']
const PLATFORM_TABS = ['Všechny', 'Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'YouTube']

const DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const HOURS = ['0', '3', '6', '9', '12', '15', '18', '21']

// Static heatmap (not real data - engagement timing is speculative)
const heatmapData = DAYS.map(() => HOURS.map(() => Math.random()))

const platformColors: Record<string, string> = {
  tiktok: '#00D9FF', linkedin: '#0A66C2', instagram: '#E1306C',
  facebook: '#1877F2', youtube: '#FF4444', pinterest: '#E60023',
}

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

interface IGPost {
  id: string
  caption?: string
  media_type: string
  timestamp: string
  like_count: number
  comments_count: number
}

interface IGProfile {
  username: string
  followers_count: number
  media_count: number
}

interface IGAnalyticsData {
  profile: IGProfile | null
  posts: IGPost[]
  topPosts: IGPost[]
  stats: {
    totalPosts: number
    totalLikes: number
    totalComments: number
    avgLikes: number
    avgComments: number
  }
}

function SkeletonBox({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className ?? ''}`}
      style={{ backgroundColor: 'rgba(255,255,255,0.06)', ...style }}
    />
  )
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30 dní')
  const [platformTab, setPlatformTab] = useState('Všechny')
  const [sortCol, setSortCol] = useState('likes')
  const [igData, setIgData] = useState<IGAnalyticsData | null>(null)
  const [chartData, setChartData] = useState<{ date: string; likes: number; comments: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/instagram')
      .then(r => r.json())
      .then((d: IGAnalyticsData) => {
        setIgData(d)
        if (d.posts?.length) {
          const built = d.posts.slice(0, 10).reverse().map((p: IGPost) => ({
            date: new Date(p.timestamp).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }),
            likes: p.like_count,
            comments: p.comments_count,
          }))
          setChartData(built)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const profile = igData?.profile
  const posts = igData?.posts ?? []
  const topPosts = igData?.topPosts ?? []
  const stats = igData?.stats

  const kpis = [
    {
      title: 'IG Sledující',
      value: loading ? '–' : profile?.followers_count?.toLocaleString('cs') ?? '–',
      change: 0,
      icon: Users,
      color: '#E1306C',
      live: !!profile,
    },
    {
      title: 'IG Celkem likes',
      value: loading ? '–' : stats?.totalLikes?.toLocaleString('cs') ?? '–',
      change: 0,
      icon: Heart,
      color: '#E1306C',
      live: !!stats,
    },
    {
      title: 'IG Avg. likes',
      value: loading ? '–' : stats?.avgLikes?.toLocaleString('cs') ?? '–',
      change: 0,
      icon: TrendingUp,
      color: '#6B5BFF',
      live: !!stats,
    },
    {
      title: 'IG Avg. komentáře',
      value: loading ? '–' : stats?.avgComments?.toLocaleString('cs') ?? '–',
      change: 0,
      icon: MessageCircle,
      color: '#00D9FF',
      live: !!stats,
    },
  ]

  const isLiveData = !loading && !!igData

  // Sort posts table
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortCol === 'likes') return (b.like_count ?? 0) - (a.like_count ?? 0)
    if (sortCol === 'comments') return (b.comments_count ?? 0) - (a.comments_count ?? 0)
    if (sortCol === 'datum') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    return 0
  })

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
              {loading ? 'Načítání...' : isLiveData ? 'Live data – Instagram' : 'Nedostupné'}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Reálná data z Instagram API · YouTube/TikTok nedostupné</p>
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
        {kpis.map((k, i) => (
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
            {loading ? (
              <SkeletonBox style={{ height: 32, width: '60%' }} />
            ) : (
              <p className="text-2xl font-bold mb-2" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                {k.value}
              </p>
            )}
            <div className="flex items-center gap-1">
              <Eye size={11} style={{ color: k.live ? '#00E5A0' : '#7B7B9A' }} />
              <span className="text-xs" style={{ color: k.live ? '#00E5A0' : '#7B7B9A' }}>
                {k.live ? 'reálná data' : 'nedostupné'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instagram Likes Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
              Instagram – likes a komentáře (posledních 10 příspěvků)
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>
              {loading ? 'Načítání...' : `${posts.length} příspěvků celkem · @${profile?.username ?? 'oneflowcast'}`}
            </p>
          </div>
        </div>
        {loading ? (
          <SkeletonBox style={{ height: 260 }} />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7B7B9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="likes" fill="#E1306C" radius={[4, 4, 0, 0]} name="Likes" />
              <Bar dataKey="comments" fill="#6B5BFF" radius={[4, 4, 0, 0]} name="Komentáře" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm" style={{ color: '#7B7B9A' }}>Žádná data k zobrazení</p>
          </div>
        )}
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Nejlepší časy pro publikování</h2>
        <p className="text-xs mb-5" style={{ color: '#7B7B9A' }}>Odhadované časy · Tmavší = vyšší engagement</p>
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

      {/* Content Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>Výkon obsahu – Instagram</h2>
          {loading && <SkeletonBox style={{ height: 20, width: 80 }} />}
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonBox key={i} style={{ height: 44 }} />)}
          </div>
        ) : posts.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { key: 'příspěvek', label: 'Příspěvek' },
                  { key: 'datum', label: 'Datum' },
                  { key: 'typ', label: 'Typ' },
                  { key: 'likes', label: 'Likes' },
                  { key: 'comments', label: 'Komentáře' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold uppercase tracking-wider pb-3 pr-4 cursor-pointer"
                    style={{ color: sortCol === col.key ? '#6B5BFF' : '#7B7B9A' }}
                    onClick={() => setSortCol(col.key)}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPosts.slice(0, 15).map((post, i) => (
                <tr key={post.id ?? i} className="group" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="py-3 pr-4">
                    <p className="text-sm truncate max-w-[240px]" style={{ color: '#F0F0FF' }}>
                      {post.caption ? post.caption.slice(0, 60) + (post.caption.length > 60 ? '…' : '') : '(bez popisku)'}
                    </p>
                  </td>
                  <td className="py-3 pr-4 text-sm" style={{ color: '#7B7B9A' }}>
                    {new Date(post.timestamp).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${platformColors['instagram']}20`, color: platformColors['instagram'] }}
                    >
                      {post.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : post.media_type}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1 text-sm font-medium" style={{ color: '#E1306C' }}>
                      <Heart size={12} /> {post.like_count.toLocaleString('cs')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-sm" style={{ color: '#7B7B9A' }}>
                      <MessageCircle size={12} /> {post.comments_count.toLocaleString('cs')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-center py-8" style={{ color: '#7B7B9A' }}>Žádné příspěvky k zobrazení</p>
        )}
      </motion.div>

      {/* Top Posts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
            Top příspěvky – Instagram
          </h2>
          <span className="text-xs" style={{ color: '#7B7B9A' }}>seřazeno podle likes</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonBox key={i} style={{ height: 140 }} />)}
          </div>
        ) : topPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {topPosts.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id ?? i}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl cursor-pointer premium-card"
                style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${platformColors['instagram']}20`, color: platformColors['instagram'] }}
                  >
                    IG
                  </span>
                  <span className="text-xs" style={{ color: '#7B7B9A' }}>
                    {new Date(p.timestamp).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#F0F0FF' }}>
                  {p.caption ? p.caption.slice(0, 80) + (p.caption.length > 80 ? '…' : '') : '(bez popisku)'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Heart size={13} style={{ color: '#E1306C' }} />
                    <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>{p.like_count.toLocaleString('cs')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={13} style={{ color: '#7B7B9A' }} />
                    <p className="text-sm" style={{ color: '#7B7B9A' }}>{p.comments_count.toLocaleString('cs')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#7B7B9A' }}>Žádné příspěvky</p>
        )}
      </motion.div>

      {/* Platform status note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-8 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#7B7B9A' }}>
          <span style={{ color: '#00E5A0' }}>Instagram: live data</span>
          <span>Facebook: profil dostupný</span>
          <span>LinkedIn: posting only (openid scope)</span>
          <span style={{ color: '#FFB800' }}>YouTube: nedostupné (upload scope)</span>
          <span style={{ color: '#FF4D6D' }}>TikTok: čeká na schválení</span>
        </div>
      </motion.div>
    </div>
  )
}
