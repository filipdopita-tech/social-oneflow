'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users, BarChart2, Calendar, TrendingUp, Upload, Send, ArrowRight, Activity,
  Image, Video, Layers, Heart, MessageCircle, Radio,
} from 'lucide-react'
import CircularProgress from '@/components/ui/CircularProgress'
import GlassCard from '@/components/ui/GlassCard'

interface IGPost {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  thumbnail_url?: string
  timestamp: string
  like_count: number
  comments_count: number
}

interface FBPost {
  id: string
  message?: string
  story?: string
  created_time: string
  likes?: { summary: { total_count: number } }
  comments?: { summary: { total_count: number } }
}

interface DashboardData {
  instagram: {
    username: string
    followers: number
    following: number
    posts: number
    bio: string
    avatar: string
    avgEngagement: string
    recentPosts: IGPost[]
  } | null
  facebook: {
    name: string
    fans: number
    followers: number
    recentPosts: FBPost[]
  } | null
  linkedin: {
    name: string
    firstName: string
    lastName: string
    email: string
    avatar: string
  } | null
  youtube: null
  tiktok: null
  fetchedAt: string
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function MediaTypeIcon({ type }: { type: string }) {
  if (type === 'VIDEO') return <Video size={12} style={{ color: '#00D9FF' }} />
  if (type === 'CAROUSEL_ALBUM') return <Layers size={12} style={{ color: '#FFB800' }} />
  return <Image size={12} style={{ color: '#E1306C' }} />
}

function SkeletonBox({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className ?? ''}`}
      style={{ backgroundColor: 'rgba(255,255,255,0.06)', ...style }}
    />
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then((d: DashboardData) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const ig = data?.instagram
  const fb = data?.facebook
  const li = data?.linkedin

  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <h1
            className="text-4xl font-bold mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(to right, #F0F0FF, #7B7B9A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {greeting}, Filip
          </h1>
          <p className="text-sm" style={{ color: '#7B7B9A' }}>
            {now.toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio?tab=import"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0FF' }}
          >
            <Upload size={15} />
            Import z Drive
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0FF' }}
          >
            <Send size={15} />
            Schedule All
          </button>
          <Link
            href="/studio"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff', boxShadow: '0 0 20px rgba(107,91,255,0.3)' }}
          >
            <span style={{ fontSize: 16 }}>+</span>
            Nový příspěvek
          </Link>
        </div>
      </motion.div>

      {/* Platform Overview */}
      <GlassCard delay={0.1} className="mb-8 p-6 premium-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
              Platform Overview
            </h2>
            {!loading && data && (
              <span
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'rgba(0,229,160,0.15)',
                  border: '1px solid rgba(0,229,160,0.4)',
                  color: '#00E5A0',
                }}
              >
                <Radio size={10} />
                Live Data
              </span>
            )}
          </div>
          <Link href="/analytics" className="flex items-center gap-1 text-sm" style={{ color: '#6B5BFF' }}>
            Zobrazit vše <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBox key={i} style={{ height: 140 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {/* Instagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl flex flex-col items-center text-center cursor-pointer premium-card"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="w-12 h-12 rounded-full mb-2 overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E1306C, #F56040, #FCAF45)', padding: ig?.avatar ? 0 : 2 }}>
                {ig?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ig.avatar} alt="IG" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-white font-bold text-sm">IG</span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ color: '#F0F0FF' }}>Instagram</p>
              <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>@{ig?.username ?? 'oneflowcast'}</p>
              <p className="text-xl font-bold mt-2" style={{ color: '#E1306C', fontFamily: 'var(--font-mono)' }}>
                {ig?.followers?.toLocaleString('cs') ?? '–'}
              </p>
              <p className="text-[10px]" style={{ color: '#7B7B9A' }}>sledujících</p>
              <div className="mt-2 w-full space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: '#7B7B9A' }}>Příspěvky</span>
                  <span style={{ color: '#F0F0FF' }}>{ig?.posts?.toLocaleString('cs') ?? '–'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: '#7B7B9A' }}>Avg eng.</span>
                  <span style={{ color: '#00E5A0' }}>{ig?.avgEngagement ?? '–'}</span>
                </div>
              </div>
            </motion.div>

            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl flex flex-col items-center text-center cursor-pointer premium-card"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(24,119,242,0.2)' }}>
                <span className="font-bold text-lg" style={{ color: '#1877F2' }}>f</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#F0F0FF' }}>Facebook</p>
              <p className="text-xs mt-0.5 truncate w-full" style={{ color: '#7B7B9A' }}>{fb?.name ?? 'OneFlow'}</p>
              <p className="text-xl font-bold mt-2" style={{ color: '#1877F2', fontFamily: 'var(--font-mono)' }}>
                {fb?.fans?.toLocaleString('cs') ?? '–'}
              </p>
              <p className="text-[10px]" style={{ color: '#7B7B9A' }}>fanoušků</p>
              <div className="mt-2 w-full space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: '#7B7B9A' }}>Sledující</span>
                  <span style={{ color: '#F0F0FF' }}>{fb?.followers?.toLocaleString('cs') ?? '–'}</span>
                </div>
              </div>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl flex flex-col items-center text-center cursor-pointer premium-card"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="w-12 h-12 rounded-full mb-2 overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: 'rgba(10,102,194,0.2)' }}>
                {li?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={li.avatar} alt="LI" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="font-bold text-sm" style={{ color: '#0A66C2' }}>in</span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ color: '#F0F0FF' }}>LinkedIn</p>
              <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>{li?.name ?? 'Filip Dopita'}</p>
              <span
                className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(0,229,160,0.15)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.3)' }}
              >
                Připojeno
              </span>
              <div className="mt-2 w-full">
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: '#7B7B9A' }}>Posting</span>
                  <span style={{ color: '#00E5A0' }}>funkční</span>
                </div>
              </div>
            </motion.div>

            {/* YouTube */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl flex flex-col items-center text-center"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)', opacity: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,68,68,0.15)' }}>
                <span className="font-bold text-sm" style={{ color: '#FF4444' }}>YT</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#F0F0FF' }}>YouTube</p>
              <span
                className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,184,0,0.15)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.3)' }}
              >
                Není k dispozici
              </span>
              <p className="text-[10px] mt-2 text-center" style={{ color: '#7B7B9A' }}>
                Token scope: upload only
              </p>
            </motion.div>

            {/* TikTok */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="p-4 rounded-xl flex flex-col items-center text-center"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)', opacity: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,217,255,0.15)' }}>
                <span className="font-bold text-sm" style={{ color: '#00D9FF' }}>TT</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#F0F0FF' }}>TikTok</p>
              <span
                className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }}
              >
                Čeká na schválení
              </span>
              <p className="text-[10px] mt-2 text-center" style={{ color: '#7B7B9A' }}>
                App pending review
              </p>
            </motion.div>
          </div>
        )}
      </GlassCard>

      {/* Bottom row: Instagram posts + Facebook posts + LinkedIn */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Instagram Posts */}
        <GlassCard delay={0.4} className="col-span-7 p-6 premium-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
                Instagram – poslední příspěvky
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>
                {ig ? `@${ig.username} · ${ig.posts} celkem` : 'Načítání...'}
              </p>
            </div>
            <Link href="/analytics" className="flex items-center gap-1 text-sm" style={{ color: '#6B5BFF' }}>
              Zobrazit vše <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox key={i} style={{ height: 100 }} />
              ))}
            </div>
          ) : ig?.recentPosts?.length ? (
            <div className="grid grid-cols-3 gap-3">
              {ig.recentPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="p-3 rounded-xl cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    <MediaTypeIcon type={post.media_type} />
                    <span className="text-[10px]" style={{ color: '#7B7B9A' }}>{timeAgo(post.timestamp)}</span>
                  </div>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: '#F0F0FF' }}>
                    {post.caption ? post.caption.slice(0, 60) + (post.caption.length > 60 ? '…' : '') : '(bez popisku)'}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: '#E1306C' }}>
                      <Heart size={10} /> {post.like_count}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: '#7B7B9A' }}>
                      <MessageCircle size={10} /> {post.comments_count}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: '#7B7B9A' }}>
              {data ? 'Žádné příspěvky k zobrazení' : 'Nepodařilo se načíst data'}
            </p>
          )}
        </GlassCard>

        {/* Right column: Facebook + LinkedIn + Stats */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Facebook Recent Posts */}
          <GlassCard delay={0.45} className="p-5 premium-card flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
                Facebook – příspěvky
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(24,119,242,0.15)', color: '#1877F2' }}>
                {fb?.fans ?? '–'} fanoušků
              </span>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonBox key={i} style={{ height: 50 }} />)}
              </div>
            ) : fb?.recentPosts?.length ? (
              <div className="space-y-2">
                {fb.recentPosts.slice(0, 3).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-xs line-clamp-2 mb-1" style={{ color: '#F0F0FF' }}>
                      {post.message ?? post.story ?? '(bez textu)'}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px]" style={{ color: '#7B7B9A' }}>
                        {new Date(post.created_time).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: '#1877F2' }}>
                        <Heart size={10} /> {post.likes?.summary?.total_count ?? 0}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: '#7B7B9A' }}>
                {data ? 'Žádné příspěvky' : 'Načítání...'}
              </p>
            )}
          </GlassCard>

          {/* LinkedIn + Quick Stats */}
          <GlassCard delay={0.5} className="p-5 premium-card">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={16} style={{ color: '#0A66C2' }} />
              <h2 className="text-base font-semibold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)' }}>
                LinkedIn
              </h2>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(0,229,160,0.15)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.3)' }}
              >
                Připojeno
              </span>
            </div>
            {loading ? (
              <SkeletonBox style={{ height: 60 }} />
            ) : li ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: 'rgba(10,102,194,0.2)' }}>
                  {li.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={li.avatar} alt={li.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold"
                      style={{ color: '#0A66C2' }}>
                      {li.firstName?.[0]}{li.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>{li.name}</p>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>{li.email}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#7B7B9A' }}>Publikování: funkční</p>
                </div>
              </div>
            ) : (
              <p className="text-xs" style={{ color: '#7B7B9A' }}>Nedostupné</p>
            )}
          </GlassCard>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: '#6B5BFF' }} />
                <p className="text-xs" style={{ color: '#7B7B9A' }}>IG Avg. eng.</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)' }}>
                {loading ? '–' : ig?.avgEngagement ?? '–'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7B7B9A' }}>na příspěvek</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={14} style={{ color: '#00E5A0' }} />
                <p className="text-xs" style={{ color: '#7B7B9A' }}>IG Příspěvky</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)' }}>
                {loading ? '–' : ig?.posts?.toLocaleString('cs') ?? '–'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7B7B9A' }}>celkem</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} style={{ color: '#E1306C' }} />
                <p className="text-xs" style={{ color: '#7B7B9A' }}>IG Sledující</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)' }}>
                {loading ? '–' : ig?.followers?.toLocaleString('cs') ?? '–'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7B7B9A' }}>followers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} style={{ color: '#FFB800' }} />
                <p className="text-xs" style={{ color: '#7B7B9A' }}>FB Fanoušci</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#F0F0FF', fontFamily: 'var(--font-mono)' }}>
                {loading ? '–' : fb?.fans?.toLocaleString('cs') ?? '–'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7B7B9A' }}>fans</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Data freshness footer */}
      {data?.fetchedAt && (
        <p className="text-xs mt-6 text-right" style={{ color: '#7B7B9A' }}>
          Aktualizováno: {new Date(data.fetchedAt).toLocaleTimeString('cs-CZ')}
        </p>
      )}
    </div>
  )
}
