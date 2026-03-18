'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Clock, User, ChevronRight } from 'lucide-react'

const COLUMNS = [
  { id: 'idea', label: 'Nápad', color: '#7B7B9A' },
  { id: 'script', label: 'Scénář', color: '#FFB800' },
  { id: 'draft', label: 'Draft', color: '#00D9FF' },
  { id: 'review', label: 'Review', color: '#6B5BFF' },
  { id: 'approved', label: 'Schváleno', color: '#00E5A0' },
  { id: 'scheduled', label: 'Naplánováno', color: '#E1306C' },
  { id: 'published', label: 'Publikováno', color: '#0A66C2' },
]

interface Card {
  id: string
  col: string
  platform: string
  title: string
  excerpt: string
  assignee: string
  assigneeColor: string
  deadline: string
  status: string
  statusColor: string
}

const INITIAL_CARDS: Card[] = [
  { id: 'c1', col: 'idea', platform: 'tiktok', title: 'AI vs. lidský poradce', excerpt: 'Srovnání AI a klasického investičního poradce', assignee: 'J', assigneeColor: '#E1306C', deadline: '25.3.', status: 'Nápad', statusColor: '#7B7B9A' },
  { id: 'c2', col: 'idea', platform: 'instagram', title: 'Infografika: 10K → 1M', excerpt: 'Jak roste 10K za 20 let při různých výnosech', assignee: 'M', assigneeColor: '#00D9FF', deadline: '28.3.', status: 'Nápad', statusColor: '#7B7B9A' },
  { id: 'c3', col: 'script', platform: 'linkedin', title: 'Série: Finanční svoboda', excerpt: 'Díl 3: Jak nastavit pasivní příjem krok za krokem', assignee: 'F', assigneeColor: '#6B5BFF', deadline: '22.3.', status: 'Scénář', statusColor: '#FFB800' },
  { id: 'c4', col: 'script', platform: 'youtube', title: 'Rozhovor: Jan P.', excerpt: 'Investor, který za 5 let zdvojnásobil kapitál', assignee: 'F', assigneeColor: '#6B5BFF', deadline: '24.3.', status: 'Scénář', statusColor: '#FFB800' },
  { id: 'c5', col: 'draft', platform: 'instagram', title: 'Reel: Cesta k investici', excerpt: 'Short-form video o tom, jak začít investovat', assignee: 'J', assigneeColor: '#E1306C', deadline: '20.3.', status: 'Draft', statusColor: '#00D9FF' },
  { id: 'c6', col: 'draft', platform: 'tiktok', title: 'Trend audit – finance', excerpt: 'Komentář k aktuálnímu trendu ve financích', assignee: 'M', assigneeColor: '#00D9FF', deadline: '19.3.', status: 'Draft', statusColor: '#00D9FF' },
  { id: 'c7', col: 'draft', platform: 'facebook', title: 'Webinář – reminder', excerpt: 'Připomínka registrace na webinář 20.3.', assignee: 'J', assigneeColor: '#E1306C', deadline: '19.3.', status: 'Draft', statusColor: '#00D9FF' },
  { id: 'c8', col: 'review', platform: 'linkedin', title: 'OneFlow výsledky Q1', excerpt: 'Transparentní výsledky platformy za Q1 2026', assignee: 'F', assigneeColor: '#6B5BFF', deadline: '18.3.', status: 'Review', statusColor: '#6B5BFF' },
  { id: 'c9', col: 'review', platform: 'instagram', title: 'UGC: Tomáš K.', excerpt: 'Re-share obsahu investora Tomáše K.', assignee: 'J', assigneeColor: '#E1306C', deadline: '18.3.', status: 'Review', statusColor: '#6B5BFF' },
  { id: 'c10', col: 'approved', platform: 'linkedin', title: 'Nový fond announcement', excerpt: 'Oznámení nového ESG fondu dostupného od dubna', assignee: 'F', assigneeColor: '#6B5BFF', deadline: '19.3.', status: 'Schváleno', statusColor: '#00E5A0' },
  { id: 'c11', col: 'approved', platform: 'youtube', title: 'Shorts: 3 mýty', excerpt: '3 největší mýty o investování v češtině', assignee: 'M', assigneeColor: '#00D9FF', deadline: '20.3.', status: 'Schváleno', statusColor: '#00E5A0' },
  { id: 'c12', col: 'scheduled', platform: 'instagram', title: 'Investice maraton', excerpt: 'Investice jsou maraton, ne sprint', assignee: 'J', assigneeColor: '#E1306C', deadline: '19.3. 08:00', status: 'Naplánováno', statusColor: '#E1306C' },
  { id: 'c13', col: 'scheduled', platform: 'linkedin', title: 'Cash flow pro foundery', excerpt: '5 věcí, které musí vědět každý founder', assignee: 'F', assigneeColor: '#6B5BFF', deadline: '19.3. 10:30', status: 'Naplánováno', statusColor: '#E1306C' },
  { id: 'c14', col: 'published', platform: 'facebook', title: 'Partnerský program', excerpt: 'OneFlow partnerský program – pasivní příjem', assignee: 'J', assigneeColor: '#E1306C', deadline: 'publikováno', status: 'Publikováno', statusColor: '#0A66C2' },
  { id: 'c15', col: 'published', platform: 'tiktok', title: 'POV: Pasivní příjem', excerpt: 'POV: Tvoje investice roste 12% ročně', assignee: 'M', assigneeColor: '#00D9FF', deadline: 'publikováno', status: 'Publikováno', statusColor: '#0A66C2' },
  { id: 'c16', col: 'published', platform: 'linkedin', title: 'B2B finanční poradenství', excerpt: 'Podnikatele a investice – náš pohled', assignee: 'F', assigneeColor: '#6B5BFF', deadline: 'publikováno', status: 'Publikováno', statusColor: '#0A66C2' },
]

const platformColors: Record<string, string> = {
  tiktok: '#00D9FF', linkedin: '#0A66C2', instagram: '#E1306C',
  facebook: '#1877F2', youtube: '#FF4444', pinterest: '#E60023',
}

export default function PipelinePage() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    setDragOver(colId)
  }
  const handleDrop = (colId: string) => {
    if (!dragging) return
    setCards(prev => prev.map(c => c.id === dragging ? { ...c, col: colId } : c))
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0FF' }}>Pipeline</h1>
          <p className="text-sm mt-1" style={{ color: '#7B7B9A' }}>Kanban board – správa obsahu od nápadu po publikaci</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6B5BFF, #5A4BEE)', color: '#fff' }}
        >
          <Plus size={16} />
          Nová karta
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colCards = cards.filter(c => c.col === col.id)
            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={() => handleDrop(col.id)}
                className="flex flex-col rounded-2xl flex-shrink-0"
                style={{
                  width: 240,
                  backgroundColor: dragOver === col.id ? 'rgba(107,91,255,0.05)' : '#0F0F1A',
                  border: `1px solid ${dragOver === col.id ? 'rgba(107,91,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                {/* Column header */}
                <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-sm font-semibold" style={{ color: '#F0F0FF' }}>{col.label}</span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${col.color}20`, color: col.color }}
                    >
                      {colCards.length}
                    </span>
                  </div>
                  <button
                    className="w-5 h-5 flex items-center justify-center rounded-md transition-all"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#7B7B9A' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colCards.map((card) => (
                    <motion.div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id)}
                      onDragEnd={() => setDragging(null)}
                      onClick={() => setSelectedCard(card)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, backgroundColor: '#1E1E35' }}
                      className="p-3 rounded-xl cursor-pointer"
                      style={{
                        backgroundColor: '#16162A',
                        border: '1px solid rgba(255,255,255,0.06)',
                        opacity: dragging === card.id ? 0.5 : 1,
                      }}
                    >
                      {/* Platform tag */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ backgroundColor: `${platformColors[card.platform]}20`, color: platformColors[card.platform] }}
                        >
                          {card.platform.slice(0, 2).toUpperCase()}
                        </span>
                        <ChevronRight size={12} style={{ color: '#7B7B9A' }} />
                      </div>

                      <p className="text-xs font-semibold mb-1" style={{ color: '#F0F0FF' }}>{card.title}</p>
                      <p className="text-[10px] leading-relaxed mb-3 line-clamp-2" style={{ color: '#7B7B9A' }}>{card.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: '#7B7B9A' }} />
                          <span className="text-[10px]" style={{ color: '#7B7B9A' }}>{card.deadline}</span>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ backgroundColor: `${card.assigneeColor}25`, color: card.assigneeColor }}
                        >
                          {card.assignee}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card Detail Drawer */}
      <AnimatePresence>
        {selectedCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSelectedCard(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full z-50 p-6 overflow-y-auto"
              style={{ width: 380, backgroundColor: '#0F0F1A', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ backgroundColor: `${platformColors[selectedCard.platform]}20`, color: platformColors[selectedCard.platform] }}
                >
                  {selectedCard.platform.toUpperCase()}
                </span>
                <button onClick={() => setSelectedCard(null)}>
                  <X size={18} style={{ color: '#7B7B9A' }} />
                </button>
              </div>

              <h2 className="text-xl font-bold mb-2" style={{ color: '#F0F0FF' }}>{selectedCard.title}</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#7B7B9A' }}>{selectedCard.excerpt}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm" style={{ color: '#7B7B9A' }}>Status</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${selectedCard.statusColor}20`, color: selectedCard.statusColor }}
                  >
                    {selectedCard.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm" style={{ color: '#7B7B9A' }}>Deadline</span>
                  <span className="text-sm font-medium" style={{ color: '#F0F0FF' }}>{selectedCard.deadline}</span>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm" style={{ color: '#7B7B9A' }}>Přiřazeno</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${selectedCard.assigneeColor}25`, color: selectedCard.assigneeColor }}
                    >
                      {selectedCard.assignee}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider mb-3 block" style={{ color: '#7B7B9A' }}>Přesunout do</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMNS.filter(c => c.id !== selectedCard.col).map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, col: col.id } : c))
                        setSelectedCard(null)
                      }}
                      className="py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ backgroundColor: `${col.color}15`, color: col.color, border: `1px solid ${col.color}30` }}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
