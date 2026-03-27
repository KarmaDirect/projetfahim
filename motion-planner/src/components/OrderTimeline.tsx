'use client'

interface OrderTimelineProps {
  productionDays: number
  scheduledStart?: string | null
  scheduledEnd?: string | null
}

export default function OrderTimeline({ productionDays, scheduledStart, scheduledEnd }: OrderTimelineProps) {
  const days = Array.from({ length: Math.min(productionDays, 30) }, (_, i) => i)

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500">
          Durée estimée : {productionDays} jour{productionDays > 1 ? 's' : ''}
        </span>
        {scheduledStart && scheduledEnd && (
          <span className="text-xs text-gray-400">
            ({new Date(scheduledStart).toLocaleDateString('fr-FR')} → {new Date(scheduledEnd).toLocaleDateString('fr-FR')})
          </span>
        )}
      </div>
      <div className="flex gap-0.5">
        {days.map((day) => (
          <div
            key={day}
            className="h-3 flex-1 rounded-sm bg-gray-400 min-w-[4px]"
            title={`Jour ${day + 1}`}
          />
        ))}
        {productionDays > 30 && (
          <span className="text-xs text-gray-400 ml-1">+{productionDays - 30}j</span>
        )}
      </div>
    </div>
  )
}
