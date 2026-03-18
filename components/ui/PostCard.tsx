'use client'

import { motion } from 'framer-motion'
import { Clock, Eye, Heart, MessageCircle } from 'lucide-react'
import PlatformBadge from './PlatformBadge'

interface PostCardProps {
  platform: string
  content: string
  scheduledAt?: string
  status: 'draft' | 'scheduled' | 'published' | 'review'
  reach?: number
  engagement?: number
  delay?: number
  onClick?: () => void
}

const statusConfig = {
  draft: { color: '#7B7B9A', bg: 'rgba(123,123,154,0.15)', label: 'Draft' },
  scheduled: { color: '#FFB800', bg: 'rgba(255,184,0,0.15)', label: 'Scheduled' },
  published: { color: '#00E5A0', bg: 'rgba(0,229,160,0.15)', label: 'Published' },
  review: { color: '#00D9FF', bg: 'rgba(0,217,255,0.15)', label: 'Review' },
}

export default function PostCard({ platform, content, scheduledAt, status, reach, engagement, delay = 0, onClick }: PostCardProps) {
  const st = statusConfig[status]
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ backgroundColor: '#16162A' }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
      style={{
        backgroundColor: '#0F0F1A',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <PlatformBadge platform={platform} size="md" />
      <p className="flex-1 text-sm line-clamp-1" style={{ color: '#F0F0FF' }}>{content}</p>
      {scheduledAt && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Clock size={12} style={{ color: '#7B7B9A' }} />
          <span className="text-xs" style={{ color: '#7B7B9A' }}>{scheduledAt}</span>
        </div>
      )}
      {reach !== undefined && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Eye size={12} style={{ color: '#7B7B9A' }} />
          <span className="text-xs" style={{ color: '#7B7B9A' }}>{reach.toLocaleString()}</span>
        </div>
      )}
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ color: st.color, backgroundColor: st.bg }}
      >
        {st.label}
      </span>
    </motion.div>
  )
}
