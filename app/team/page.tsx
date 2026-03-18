'use client'

import { motion } from 'framer-motion'
import { Plus, Mail, Shield, User } from 'lucide-react'

const teamMembers = [
  { name: 'Filip Dopita', email: 'dopita@oneflow.cz', role: 'Admin', avatar: 'F', color: '#6B5BFF', status: 'active', postsThisMonth: 22, joinedDate: '1.1.2026' },
  { name: 'Jana Novotná', email: 'jana@oneflow.cz', role: 'Editor', avatar: 'J', color: '#E1306C', status: 'active', postsThisMonth: 18, joinedDate: '15.1.2026' },
  { name: 'Martin Kovář', email: 'martin@oneflow.cz', role: 'Creator', avatar: 'M', color: '#00D9FF', status: 'active', postsThisMonth: 14, joinedDate: '1.2.2026' },
  { name: 'Petra Malá', email: 'petra@oneflow.cz', role: 'Viewer', avatar: 'P', color: '#00E5A0', status: 'invited', postsThisMonth: 0, joinedDate: '—' },
]

const roles = [
  { name: 'Admin', color: '#6B5BFF', desc: 'Plný přístup ke všem funkcím a nastavením' },
  { name: 'Editor', color: '#FFB800', desc: 'Může vytvářet, editovat a plánovat obsah' },
  { name: 'Creator', color: '#00D9FF', desc: 'Může vytvářet a editovat drafty obsahu' },
  { name: 'Viewer', color: '#7B7B9A', desc: 'Pouze čtení – žádné úpravy' },
]

export default function TeamPage() {
  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Tým</h1>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Správa členů a jejich oprávnění</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
        >
          <Plus size={16} />
          Pozvat člena
        </button>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl cursor-pointer"
                style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: `${m.color}20`, color: m.color }}
                  >
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ color: '#F0F0FF' }}>{m.name}</p>
                    <p className="text-xs" style={{ color: '#7B7B9A' }}>{m.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: `${m.color}15`, color: m.color }}
                      >
                        {m.role}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: m.status === 'active' ? 'rgba(0,229,160,0.15)' : 'rgba(255,184,0,0.15)',
                          color: m.status === 'active' ? '#00E5A0' : '#FFB800',
                        }}
                      >
                        {m.status === 'active' ? 'Aktivní' : 'Pozváno'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-xs" style={{ color: '#7B7B9A' }}>Příspěvky (měsíc)</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: '#F0F0FF' }}>{m.postsThisMonth}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#7B7B9A' }}>Připojil se</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: '#F0F0FF' }}>{m.joinedDate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#F0F0FF' }}>Role a oprávnění</h2>
            <div className="space-y-3">
              {roles.map((r) => (
                <div key={r.name} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}15` }}>
                    <Shield size={12} style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: r.color }}>{r.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7B7B9A' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#F0F0FF' }}>Pozvat nového člena</h2>
            <input
              type="email"
              placeholder="email@firma.cz"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-3"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)', color: '#F0F0FF' }}
            />
            <select
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-3"
              style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)', color: '#F0F0FF' }}
            >
              {roles.map(r => (
                <option key={r.name} style={{ backgroundColor: '#16162A' }}>{r.name}</option>
              ))}
            </select>
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
            >
              Odeslat pozvánku
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
