'use client'

import { Check } from 'lucide-react'

const ALL_FILTERS = [
  { key: 'type', label: 'Type de projet', emoji: '🎬' },
  { key: 'format', label: 'Format (H/V)', emoji: '📐' },
  { key: 'style', label: 'Style visuel', emoji: '🎨' },
  { key: 'audience', label: 'Audience cible', emoji: '👥' },
  { key: 'software', label: 'Logiciel utilisé', emoji: '💻' },
]

interface Props {
  config: { enabled_filters: string[] }
  onChange: (config: Record<string, unknown>) => void
}

export default function FiltersConfig({ config, onChange }: Props) {
  const toggle = (key: string) => {
    const current = config.enabled_filters
    const next = current.includes(key)
      ? current.filter(f => f !== key)
      : [...current, key]
    onChange({ enabled_filters: next })
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 block mb-3">Choisissez les filtres que vos visiteurs pourront utiliser</label>
      {ALL_FILTERS.map(f => {
        const active = config.enabled_filters.includes(f.key)
        return (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
              active ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <span className="text-lg">{f.emoji}</span>
            <span className={`flex-1 text-sm font-bold ${active ? 'text-[#1F2937]' : 'text-gray-400'}`}>{f.label}</span>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
              active ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              {active && <Check size={14} />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
