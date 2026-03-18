'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Wand2,
  FolderOpen,
  Megaphone,
  BarChart3,
  KanbanSquare,
  Users,
  Settings,
  Bell,
  Zap,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/studio', icon: Wand2, label: 'Studio' },
  { href: '/library', icon: FolderOpen, label: 'Library' },
  { href: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/pipeline', icon: KanbanSquare, label: 'Pipeline' },
  { href: '/team', icon: Users, label: 'Team' },
]

const bottomItems = [
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: expanded ? 240 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0F0F1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #00D9FF)' }}
        >
          S
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="ml-3 font-bold text-base whitespace-nowrap"
              style={{ color: '#F0F0FF', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              Social OneFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className="flex items-center h-10 rounded-xl px-2 relative transition-all duration-150 cursor-pointer group"
                style={{
                  backgroundColor: isActive ? 'rgba(107, 91, 255, 0.12)' : 'transparent',
                  borderLeft: isActive ? '2px solid #6B5BFF' : '2px solid transparent',
                  boxShadow: isActive ? 'inset 4px 0 12px rgba(107,91,255,0.15)' : 'none',
                }}
              >
                <item.icon
                  size={18}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isActive ? '#6B5BFF' : '#7B7B9A' }}
                />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="ml-3 text-sm whitespace-nowrap"
                      style={{
                        color: isActive ? '#F0F0FF' : '#7B7B9A',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="py-4 px-2 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className="flex items-center h-10 rounded-xl px-2 transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'rgba(107, 91, 255, 0.12)' : 'transparent',
                }}
              >
                <item.icon size={18} className="flex-shrink-0" style={{ color: isActive ? '#6B5BFF' : '#7B7B9A' }} />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="ml-3 text-sm whitespace-nowrap"
                      style={{
                        color: isActive ? '#F0F0FF' : '#7B7B9A',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}

        {/* User avatar */}
        <div className="flex items-center h-10 px-2 mt-1 cursor-pointer rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6B5BFF, #00D9FF)', color: '#fff' }}
          >
            F
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="ml-2 flex items-center justify-between flex-1 min-w-0"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#F0F0FF' }}>Filip D.</p>
                  <p className="text-xs truncate" style={{ color: '#7B7B9A' }}>Admin</p>
                </div>
                <div className="relative flex-shrink-0">
                  <Bell size={14} style={{ color: '#7B7B9A' }} />
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#FF4D6D', color: '#fff' }}
                  >
                    3
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
