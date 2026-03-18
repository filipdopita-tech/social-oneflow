'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import SparkLine from './SparkLine'

interface StatCardProps {
  title: string
  value: string
  change: number
  data?: number[]
  color?: string
  icon?: React.ReactNode
  delay?: number
}

export default function StatCard({ title, value, change, data, color = '#6B5BFF', icon, delay = 0 }: StatCardProps) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className="rounded-xl p-5 cursor-pointer"
      style={{
        backgroundColor: '#0F0F1A',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'background-color 0.15s',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#7B7B9A' }}>{title}</p>
          <p className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>{value}</p>
        </div>
        {icon && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp size={14} style={{ color: '#00E5A0' }} />
          ) : (
            <TrendingDown size={14} style={{ color: '#FF4D6D' }} />
          )}
          <span className="text-xs font-medium" style={{ color: isPositive ? '#00E5A0' : '#FF4D6D' }}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs" style={{ color: '#7B7B9A' }}>vs last month</span>
        </div>
        {data && <SparkLine data={data} color={color} />}
      </div>
    </motion.div>
  )
}
