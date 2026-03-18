'use client'

import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  delay?: number
  onClick?: () => void
}

export default function GlassCard({ children, className = '', glowColor, delay = 0, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.005 }}
      onClick={onClick}
      className={`rounded-xl ${className}`}
      style={{
        backgroundColor: '#0F0F1A',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: glowColor ? `0 0 30px ${glowColor}15` : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </motion.div>
  )
}
