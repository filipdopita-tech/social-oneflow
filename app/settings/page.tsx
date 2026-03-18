'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Plug, Users, Bell, CreditCard, Check, X, ExternalLink, Shield, Mail, Phone,
} from 'lucide-react'

const TABS = [
  { id: 'account', label: 'Účet', icon: User },
  { id: 'integrations', label: 'Integrace', icon: Plug },
  { id: 'team', label: 'Tým', icon: Users },
  { id: 'notifications', label: 'Notifikace', icon: Bell },
  { id: 'billing', label: 'Fakturace', icon: CreditCard },
]

interface PlatformIntegration {
  id: string
  name: string
  description: string
  connected: boolean
  color: string
  username?: string
}

const socialPlatforms: PlatformIntegration[] = [
  { id: 'instagram', name: 'Instagram', description: 'Publikovat příspěvky, Stories a Reels na váš Instagram účet', connected: true, color: '#E1306C', username: '@oneflow.cz' },
  { id: 'linkedin', name: 'LinkedIn', description: 'Sdílet obsah na firemní LinkedIn stránce', connected: true, color: '#0A66C2', username: 'OneFlow s.r.o.' },
  { id: 'tiktok', name: 'TikTok', description: 'Publikovat TikTok videa a Shorts přímo z platformy', connected: true, color: '#00D9FF', username: '@oneflow_cz' },
  { id: 'facebook', name: 'Facebook', description: 'Spravovat Facebook stránku a publikovat příspěvky', connected: true, color: '#1877F2', username: 'OneFlow' },
  { id: 'youtube', name: 'YouTube', description: 'Nahrávat videa a Shorts na YouTube kanál', connected: false, color: '#FF4444' },
  { id: 'pinterest', name: 'Pinterest', description: 'Vytvářet Piny a spravovat vaše boardy', connected: false, color: '#E60023' },
]

const teamMembers = [
  { name: 'Filip Dopita', email: 'dopita@oneflow.cz', role: 'Admin', avatar: 'F', color: '#6B5BFF', status: 'active' },
  { name: 'Jana Novotná', email: 'jana@oneflow.cz', role: 'Editor', avatar: 'J', color: '#E1306C', status: 'active' },
  { name: 'Martin Kovář', email: 'martin@oneflow.cz', role: 'Creator', avatar: 'M', color: '#00D9FF', status: 'active' },
  { name: 'Petra Malá', email: 'petra@oneflow.cz', role: 'Viewer', avatar: 'P', color: '#00E5A0', status: 'invited' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('integrations')
  const [platforms, setPlatforms] = useState<PlatformIntegration[]>(socialPlatforms)
  const [googleDriveConnected, setGoogleDriveConnected] = useState(true)

  const togglePlatform = (id: string) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p))
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Nastavení</h1>
        <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Správa účtu, integrací a nastavení platformy</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 rounded-xl p-1 w-fit" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.id ? 'rgba(107,91,255,0.2)' : 'transparent',
              color: tab === t.id ? '#6B5BFF' : '#7B7B9A',
            }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {tab === 'account' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 rounded-2xl" style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-lg font-semibold mb-5" style={{ color: '#F0F0FF' }}>Profil</h2>
            <div className="flex items-center gap-5 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #6B5BFF, #00D9FF)', color: '#fff' }}
              >
                F
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#F0F0FF' }}>Filip Dopita</p>
                <p className="text-sm" style={{ color: '#7B7B9A' }}>Founder & Admin · OneFlow</p>
                <button className="text-xs mt-1" style={{ color: '#6B5BFF' }}>Změnit profilový obrázek</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Jméno', value: 'Filip Dopita', icon: User },
                { label: 'Email', value: 'dopita@oneflow.cz', icon: Mail },
                { label: 'Telefon', value: '+420 607 445 004', icon: Phone },
                { label: 'Role', value: 'Admin', icon: Shield },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#7B7B9A' }}>{f.label}</label>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ backgroundColor: '#16162A', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <f.icon size={14} style={{ color: '#7B7B9A' }} />
                    <span className="text-sm" style={{ color: '#F0F0FF' }}>{f.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
              >
                Uložit změny
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Integrations Tab */}
      {tab === 'integrations' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Google Drive */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: googleDriveConnected
                ? 'linear-gradient(135deg, rgba(0,229,160,0.06), rgba(0,217,255,0.04))'
                : 'linear-gradient(135deg, rgba(107,91,255,0.06), rgba(0,217,255,0.04))',
              border: googleDriveConnected ? '1px solid rgba(0,229,160,0.2)' : '1px solid rgba(107,91,255,0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  📁
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#F0F0FF' }}>Google Drive</h3>
                  <p className="text-sm mt-0.5" style={{ color: '#7B7B9A' }}>
                    Importujte obsah přímo z Google Drive a Dokumentů
                  </p>
                  {googleDriveConnected && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00E5A0' }} />
                      <span className="text-xs" style={{ color: '#00E5A0' }}>Připojeno · dopita@oneflow.cz</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setGoogleDriveConnected(!googleDriveConnected)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  googleDriveConnected
                    ? { backgroundColor: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }
                    : { background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }
                }
              >
                {googleDriveConnected ? (
                  <><X size={15} /> Odpojit</>
                ) : (
                  <><ExternalLink size={15} /> Připojit Google Drive</>
                )}
              </button>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#F0F0FF' }}>Sociální sítě</h2>
            <div className="space-y-3">
              {platforms.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    backgroundColor: '#0F0F1A',
                    border: `1px solid ${p.connected ? p.color + '20' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ backgroundColor: `${p.color}15`, color: p.color }}
                  >
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={{ color: '#F0F0FF' }}>{p.name}</p>
                      {p.connected && (
                        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,229,160,0.15)', color: '#00E5A0' }}>
                          <Check size={9} />
                          Připojeno
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>{p.description}</p>
                    {p.connected && p.username && (
                      <p className="text-xs mt-0.5 font-medium" style={{ color: p.color }}>{p.username}</p>
                    )}
                  </div>
                  <button
                    onClick={() => togglePlatform(p.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
                    style={
                      p.connected
                        ? { backgroundColor: 'rgba(255,77,109,0.1)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.2)' }
                        : { backgroundColor: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }
                    }
                  >
                    {p.connected ? (
                      <><X size={13} /> Odpojit</>
                    ) : (
                      <><ExternalLink size={13} /> Připojit</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Team Tab */}
      {tab === 'team' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div />
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
            >
              + Pozvat člena
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {teamMembers.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4"
                style={{ borderBottom: i < teamMembers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', backgroundColor: i % 2 === 0 ? '#0F0F1A' : 'rgba(255,255,255,0.01)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: `${m.color}20`, color: m.color }}
                >
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>{m.name}</p>
                  <p className="text-xs" style={{ color: '#7B7B9A' }}>{m.email}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
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
            ))}
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0F0F1A' }}>
            {[
              { label: 'Příspěvek publikován', desc: 'Notifikace při úspěšné publikaci', enabled: true },
              { label: 'Čeká na schválení', desc: 'Příspěvek čeká na vaše schválení', enabled: true },
              { label: 'Kampaň končí', desc: 'Připomenutí 24 hodin před koncem kampaně', enabled: true },
              { label: 'Nový komentář', desc: 'Někdo komentoval váš příspěvek', enabled: false },
              { label: 'Týdenní report', desc: 'Souhrn výkonu zaslaný každé pondělí', enabled: true },
              { label: 'Upozornění na chyby', desc: 'Při selhání plánování nebo publikace', enabled: true },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4"
                style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F0F0FF' }}>{n.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7B7B9A' }}>{n.desc}</p>
                </div>
                <div
                  className="w-11 h-6 rounded-full relative cursor-pointer transition-all"
                  style={{ backgroundColor: n.enabled ? '#6B5BFF' : 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      left: n.enabled ? '22px' : '2px',
                      backgroundColor: '#fff',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Billing Tab */}
      {tab === 'billing' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(107,91,255,0.1), rgba(0,217,255,0.06))',
              border: '1px solid rgba(107,91,255,0.25)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#6B5BFF' }}>Aktuální plán</p>
                <h2 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Pro Plan</h2>
                <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>3 uživatelé · 6 platforem · Neomezené příspěvky</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{ color: '#F0F0FF' }}>1 490 Kč</p>
                <p className="text-sm" style={{ color: '#7B7B9A' }}>/měsíc · fakturováno ročně</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Příspěvky tento měsíc', value: '47', max: '∞' },
              { label: 'Aktivní kampaně', value: '5', max: '∞' },
              { label: 'Členové týmu', value: '4', max: '5' },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>{s.value}</p>
                <p className="text-xs mt-0.5 mb-2" style={{ color: '#7B7B9A' }}>{s.label}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: s.max === '∞' ? '40%' : '80%', backgroundColor: '#6B5BFF' }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: '#7B7B9A' }}>z {s.max}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
