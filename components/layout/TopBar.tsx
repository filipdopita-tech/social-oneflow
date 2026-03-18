'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Sparkles, ChevronDown, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react'

const platforms = [
  { id: 'ig', label: 'IG', connected: true },
  { id: 'li', label: 'LI', connected: true },
  { id: 'tt', label: 'TT', connected: true },
  { id: 'fb', label: 'FB', connected: true },
  { id: 'yt', label: 'YT', connected: false },
]

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = document.getElementById('global-search') as HTMLInputElement
        input?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="fixed top-0 right-0 h-16 flex items-center gap-4 px-6 z-40"
      style={{
        left: 64,
        backgroundColor: 'rgba(8, 8, 16, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Global Search */}
      <motion.div
        animate={{ width: searchFocused ? 400 : 280 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div
          className="flex items-center rounded-xl px-3 py-2 gap-2"
          style={{
            backgroundColor: searchFocused ? 'rgba(107, 91, 255, 0.08)' : 'rgba(255,255,255,0.04)',
            border: searchFocused ? '1px solid rgba(107, 91, 255, 0.4)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s',
          }}
        >
          <Search size={15} style={{ color: '#7B7B9A', flexShrink: 0 }} />
          <input
            id="global-search"
            type="text"
            placeholder="Search posts, campaigns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-sm outline-none min-w-0"
            style={{ color: '#F0F0FF' }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#7B7B9A',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </motion.div>

      {/* Platform Status Pills */}
      <div className="flex items-center gap-2">
        {platforms.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: p.connected ? '#F0F0FF' : '#7B7B9A',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: p.connected ? '#00E5A0' : '#FF4D6D' }}
            />
            {p.label}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* AI Assistant Button */}
      <button
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(107, 91, 255, 0.2), rgba(0, 217, 255, 0.1))',
          border: '1px solid rgba(107, 91, 255, 0.3)',
          color: '#F0F0FF',
        }}
      >
        <Sparkles size={15} style={{ color: '#6B5BFF' }} />
        AI Assistant
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <Bell size={18} style={{ color: '#7B7B9A' }} />
        <span
          className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
          style={{ backgroundColor: '#FF4D6D', color: '#fff' }}
        >
          3
        </span>
      </button>

      {/* User Menu */}
      <button
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #00D9FF)', color: '#fff' }}
        >
          F
        </div>
        <span className="text-sm font-medium" style={{ color: '#F0F0FF' }}>Filip D.</span>
        <ChevronDown size={14} style={{ color: '#7B7B9A' }} />
      </button>
    </div>
  )
}
