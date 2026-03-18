'use client'

import { motion } from 'framer-motion'
import {
  Users, Eye, BarChart2, Calendar, TrendingUp, Clock, Zap, Upload, Send, ArrowRight, Activity,
} from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import CircularProgress from '@/components/ui/CircularProgress'
import PlatformBadge from '@/components/ui/PlatformBadge'
import GlassCard from '@/components/ui/GlassCard'

const todayPosts = [
  { id: 1, platform: 'instagram', time: '08:00', text: 'Investice jsou maraton, ne sprint. Jak chránit svůj kapitál...', status: 'scheduled' as const },
  { id: 2, platform: 'linkedin', time: '10:30', text: '5 věcí, které každý founder musí vědět o cash flow...', status: 'scheduled' as const },
  { id: 3, platform: 'facebook', time: '12:00', text: 'OneFlow partnerský program – pasivní příjem bez rizika...', status: 'published' as const },
  { id: 4, platform: 'tiktok', time: '15:00', text: 'POV: Tvoje investice roste 12% ročně bez stresu...', status: 'review' as const },
  { id: 5, platform: 'youtube', time: '18:00', text: 'Jak OneFlow generuje stabilní výnos pro české firmy...', status: 'draft' as const },
]

const recentActivity = [
  { who: 'Jana N.', action: 'publikovala příspěvek na Instagram', when: '2 min', avatar: 'J', color: '#E1306C' },
  { who: 'Filip D.', action: 'schválil kampaň Q1 2026', when: '14 min', avatar: 'F', color: '#6B5BFF' },
  { who: 'Martin K.', action: 'nahrál 3 nové obrázky do Library', when: '1 hod', avatar: 'M', color: '#00D9FF' },
  { who: 'Jana N.', action: 'vytvořila draft pro LinkedIn sérii', when: '2 hod', avatar: 'J', color: '#E1306C' },
  { who: 'Filip D.', action: 'nastavil kampaň Jarní Investice', when: '3 hod', avatar: 'F', color: '#6B5BFF' },
]

const platforms = [
  { id: 'instagram', name: 'Instagram', followers: '12.4K', reach: '48.2K', engagement: '4.8%', score: 82, color: '#E1306C' },
  { id: 'linkedin', name: 'LinkedIn', followers: '8.7K', reach: '31.5K', engagement: '5.2%', score: 91, color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', followers: '24.1K', reach: '187K', engagement: '6.4%', score: 76, color: '#00D9FF' },
  { id: 'facebook', name: 'Facebook', followers: '5.3K', reach: '22.1K', engagement: '2.1%', score: 64, color: '#1877F2' },
  { id: 'youtube', name: 'YouTube', followers: '3.8K', reach: '14.7K', engagement: '3.9%', score: 71, color: '#FF4444' },
  { id: 'pinterest', name: 'Pinterest', followers: '1.2K', reach: '8.3K', engagement: '1.8%', score: 58, color: '#E60023' },
]

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: '#7B7B9A', bg: 'rgba(123,123,154,0.15)', label: 'Draft' },
  scheduled: { color: '#FFB800', bg: 'rgba(255,184,0,0.15)', label: 'Naplánováno' },
  published: { color: '#00E5A0', bg: 'rgba(0,229,160,0.15)', label: 'Publikováno' },
  review: { color: '#00D9FF', bg: 'rgba(0,217,255,0.15)', label: 'Review' },
}

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

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
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#F0F0FF' }}>
            {greeting}, Filip
          </h1>
          <p className="text-sm" style={{ color: '#7B7B9A' }}>
            {now.toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0FF' }}
          >
            <Upload size={15} />
            Import z Drive
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0FF' }}
          >
            <Send size={15} />
            Schedule All
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff', boxShadow: '0 0 20px rgba(107,91,255,0.3)' }}
          >
            <span style={{ fontSize: 16 }}>+</span>
            Nový příspěvek
          </button>
        </div>
      </motion.div>

      {/* AI Brief */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8 p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(107,91,255,0.08), rgba(0,217,255,0.05))',
          border: '1px solid rgba(107,91,255,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} style={{ color: '#6B5BFF' }} />
          <span className="text-sm font-semibold" style={{ color: '#6B5BFF' }}>AI denní brief</span>
        </div>
        <ul className="space-y-2">
          {[
            { dot: '#00E5A0', text: 'TikTok engagement vzrostl o 18% — ideální čas publikovat video o investičních příležitostech' },
            { dot: '#FFB800', text: 'LinkedIn příspěvek z úterý dosahuje nejlepšího CTR v historii (8.3%) — doporučuji boostat' },
            { dot: '#00D9FF', text: 'Máte 2 příspěvky čekající na schválení a kampaň Q1 končí za 3 dny' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#F0F0FF' }}>
              <span style={{ color: item.dot, marginTop: 1 }}>•</span>
              {item.text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Top row: Content Score + Stats */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Content Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="col-span-3 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(107,91,255,0.08) 0%, #0F0F1A 70%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-sm font-medium mb-4" style={{ color: '#7B7B9A' }}>Content Health Score</p>
          <CircularProgress value={87} size={140} strokeWidth={10} color="#6B5BFF" />
          <div className="mt-4 text-center">
            <p className="text-xs font-semibold" style={{ color: '#00E5A0' }}>Excellent</p>
            <p className="text-xs mt-1" style={{ color: '#7B7B9A' }}>+5 bodů oproti minulý týden</p>
          </div>
          <div className="w-full mt-4 space-y-2">
            {[
              { label: 'Konzistence', value: 92 },
              { label: 'Engagement', value: 85 },
              { label: 'Brand Voice', value: 88 },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#7B7B9A' }}>{m.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: '#6B5BFF' }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#F0F0FF' }}>{m.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats 2x2 grid */}
        <div className="col-span-9 grid grid-cols-2 gap-4">
          <StatCard
            title="Celkový dosah (měsíc)"
            value="312,480"
            change={14.2}
            data={[210000, 230000, 245000, 220000, 260000, 285000, 312480]}
            color="#6B5BFF"
            icon={<Eye size={18} />}
            delay={0.2}
          />
          <StatCard
            title="Engagement Rate"
            value="4.72%"
            change={8.3}
            data={[3.1, 3.8, 4.1, 3.9, 4.4, 4.6, 4.72]}
            color="#00D9FF"
            icon={<TrendingUp size={18} />}
            delay={0.25}
          />
          <StatCard
            title="Příspěvky naplánované"
            value="47"
            change={22.5}
            data={[20, 25, 31, 28, 38, 42, 47]}
            color="#00E5A0"
            icon={<Calendar size={18} />}
            delay={0.3}
          />
          <StatCard
            title="Aktivní kampaně"
            value="5"
            change={-1}
            data={[3, 4, 6, 5, 5, 6, 5]}
            color="#FFB800"
            icon={<BarChart2 size={18} />}
            delay={0.35}
          />
        </div>
      </div>

      {/* Platform Performance */}
      <GlassCard delay={0.4} className="mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF' }}>Platform Performance</h2>
          <button className="flex items-center gap-1 text-sm" style={{ color: '#6B5BFF' }}>
            Zobrazit vše <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {platforms.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl flex flex-col items-center text-center cursor-pointer"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <CircularProgress value={p.score} size={72} strokeWidth={6} color={p.color} showValue={true} />
              <p className="text-xs font-semibold mt-2" style={{ color: '#F0F0FF' }}>{p.name}</p>
              <p className="text-xs mt-1" style={{ color: '#7B7B9A' }}>{p.followers}</p>
              <div className="mt-2 w-full">
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: '#7B7B9A' }}>Reach</span>
                  <span style={{ color: p.color }}>{p.reach}</span>
                </div>
                <div className="flex justify-between text-[10px] mt-0.5">
                  <span style={{ color: '#7B7B9A' }}>Eng.</span>
                  <span style={{ color: '#00E5A0' }}>{p.engagement}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Bottom row: Today's Queue + Activity */}
      <div className="grid grid-cols-12 gap-6">
        {/* Today's Queue */}
        <GlassCard delay={0.5} className="col-span-7 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF' }}>Dnešní fronta</h2>
              <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>5 příspěvků naplánováno na dnes</p>
            </div>
            <button className="flex items-center gap-1 text-sm" style={{ color: '#6B5BFF' }}>
              Spravovat <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {todayPosts.map((post, i) => {
              const st = statusConfig[post.status]
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  whileHover={{ backgroundColor: '#16162A' }}
                  className="flex items-center gap-4 p-3.5 rounded-xl cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <PlatformBadge platform={post.platform} size="md" />
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={13} style={{ color: '#7B7B9A' }} />
                    <span className="text-xs font-medium" style={{ color: '#7B7B9A' }}>{post.time}</span>
                  </div>
                  <p className="flex-1 text-sm truncate" style={{ color: '#F0F0FF' }}>{post.text}</p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: st.color, backgroundColor: st.bg }}
                  >
                    {st.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard delay={0.55} className="col-span-5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#F0F0FF' }}>Nedávná aktivita</h2>
              <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>Co se děje v týmu</p>
            </div>
            <Activity size={16} style={{ color: '#7B7B9A' }} />
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: '#F0F0FF' }}>
                    <span className="font-medium">{item.who}</span>{' '}
                    <span style={{ color: '#7B7B9A' }}>{item.action}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>před {item.when}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
