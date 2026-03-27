'use client'

import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import type { PortfolioBlock } from '@/lib/types'
import { BLOCK_REGISTRY } from '@/lib/block-registry'

interface Props {
  blocks: PortfolioBlock[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
  onRemove: (id: string) => void
}

export default function BlockList({ blocks, selectedId, onSelect, onToggle, onReorder, onRemove }: Props) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-1.5">
      {sorted.map((block, i) => {
        const meta = BLOCK_REGISTRY[block.type]
        const isSelected = selectedId === block.id
        return (
          <div
            key={block.id}
            onClick={() => onSelect(block.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            {/* Toggle */}
            <button
              onClick={e => { e.stopPropagation(); onToggle(block.id) }}
              className={`w-8 h-5 rounded-full relative transition-colors cursor-pointer ${block.enabled ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${block.enabled ? 'left-3.5' : 'left-0.5'}`} />
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${block.enabled ? 'text-[#1F2937]' : 'text-gray-400'}`}>{meta.label}</p>
              <p className="text-[10px] text-gray-500 truncate">{meta.description}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); onReorder(block.id, 'up') }}
                disabled={i === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 cursor-pointer disabled:cursor-default"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onReorder(block.id, 'down') }}
                disabled={i === sorted.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 cursor-pointer disabled:cursor-default"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onRemove(block.id) }}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
