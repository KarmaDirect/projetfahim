'use client'

import { Check } from 'lucide-react'
import type { AvailabilityWidgetConfig } from '@/lib/types'

interface Props {
  config: AvailabilityWidgetConfig
  onChange: (config: Record<string, unknown>) => void
}

const STATUSES = [
  { value: 'available', label: 'Disponible', color: 'bg-emerald-400', ring: 'ring-emerald-400/20' },
  { value: 'busy', label: 'Occupé', color: 'bg-amber-400', ring: 'ring-amber-400/20' },
  { value: 'unavailable', label: 'Indisponible', color: 'bg-red-400', ring: 'ring-red-400/20' },
] as const

export default function AvailabilityConfig({ config, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-3">Votre statut actuel</label>
        <div className="grid grid-cols-3 gap-2">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => onChange({ status: s.value })}
              className={`py-3.5 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-2 ${
                config.status === s.value
                  ? `border-primary bg-primary/5`
                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${s.color} ${config.status === s.value ? `ring-4 ${s.ring}` : ''}`} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-2">Message personnalisé</label>
        <input
          value={config.message}
          onChange={e => onChange({ message: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl bg-[#FAFBFC] border border-gray-100 text-sm focus:border-primary focus:outline-none"
          placeholder="Ex: Disponible pour de nouveaux projets"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-2">Délai moyen de livraison</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={30}
            value={config.average_delivery_days}
            onChange={e => onChange({ average_delivery_days: Number(e.target.value) })}
            className="flex-1 accent-primary h-2"
          />
          <span className="w-20 text-center px-3 py-2 rounded-xl bg-[#FAFBFC] border border-gray-100 text-sm font-bold text-[#1F2937]">
            {config.average_delivery_days}j
          </span>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-2">Prochaine disponibilité</label>
        <input
          type="date"
          value={config.next_available_date || ''}
          onChange={e => onChange({ next_available_date: e.target.value || null })}
          className="w-full px-4 py-3 rounded-2xl bg-[#FAFBFC] border border-gray-100 text-sm focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  )
}
