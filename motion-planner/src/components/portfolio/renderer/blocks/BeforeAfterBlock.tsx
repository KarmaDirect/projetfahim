'use client'

import { useState, useRef, useCallback } from 'react'
import BlockWrapper from '../BlockWrapper'

interface Item {
  id: string
  before_url: string
  after_url: string
  label: string
}

interface Props {
  config: { items: Item[] }
}

function Slider({ item }: { item: Item }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePos(e.clientX)
  }, [updatePos])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging.current) updatePos(e.clientX)
  }, [updatePos])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div className="relative">
      <p className="text-lg font-bold mb-3">{item.label}</p>
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* After (full) */}
        <img src={item.after_url} alt="Après" className="absolute inset-0 w-full h-full object-cover" />
        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={item.before_url} alt="Avant" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${containerRef.current?.offsetWidth || 1000}px` }} />
        </div>
        {/* Divider */}
        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"><path d="M8 18l-6-6 6-6M16 6l6 6-6 6"/></svg>
          </div>
        </div>
        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Avant</div>
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Après</div>
      </div>
    </div>
  )
}

export default function BeforeAfterBlock({ config }: Props) {
  if (!config.items || config.items.length === 0) return null

  return (
    <BlockWrapper>
      <h2 className="text-3xl md:text-4xl font-black mb-2">Avant / Après</h2>
      <p className="text-gray-400 mb-10">Faites glisser pour voir la transformation.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {config.items.map(item => (
          <Slider key={item.id} item={item} />
        ))}
      </div>
    </BlockWrapper>
  )
}
