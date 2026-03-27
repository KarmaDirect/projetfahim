'use client'

import { Clock, CalendarDays } from 'lucide-react'
import type { AvailabilityWidgetConfig } from '@/lib/types'
import BlockWrapper from '../BlockWrapper'

interface Props {
  config: AvailabilityWidgetConfig
}

const STATUS_MAP = {
  available: { label: 'Disponible', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', dot: 'bg-emerald-400' },
  busy: { label: 'Occupé', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', dot: 'bg-amber-400' },
  unavailable: { label: 'Indisponible', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
} as const

export default function AvailabilityBlock({ config }: Props) {
  const s = STATUS_MAP[config.status]

  const formattedDate = config.next_available_date
    ? new Date(config.next_available_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <BlockWrapper>
      <div className={`inline-flex items-center gap-6 ${s.bg} ${s.border} border rounded-[28px] px-8 py-6`}>
        {/* Status */}
        <div className="flex items-center gap-3">
          <span className={`relative flex h-3 w-3`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${s.dot}`} />
          </span>
          <div>
            <p className={`text-lg font-black ${s.color}`}>{s.label}</p>
            {config.message && <p className="text-sm text-gray-400">{config.message}</p>}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-12 bg-white/10" />

        {/* Delivery time */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Délai moyen</p>
            <p className="font-bold">{config.average_delivery_days} jours</p>
          </div>
        </div>

        {/* Next available */}
        {formattedDate && config.status !== 'available' && (
          <>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prochaine dispo</p>
                <p className="font-bold">{formattedDate}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </BlockWrapper>
  )
}
