'use client'

import { Play } from 'lucide-react'

interface Props {
  config: { clip_duration_seconds: number; transition_style: string; project_ids: string[] }
  onChange: (config: Record<string, unknown>) => void
}

export default function ShowreelConfig({ config, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-2">Durée par clip</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={15}
            value={config.clip_duration_seconds}
            onChange={e => onChange({ clip_duration_seconds: Number(e.target.value) })}
            className="flex-1 accent-primary h-2"
          />
          <span className="w-16 text-center px-3 py-2 rounded-xl bg-[#FAFBFC] border border-gray-100 text-sm font-bold text-[#1F2937]">
            {config.clip_duration_seconds}s
          </span>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 block mb-2">Transition</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'crossfade', label: 'Fondu' },
            { value: 'slide', label: 'Slide' },
            { value: 'zoom', label: 'Zoom' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ transition_style: opt.value })}
              className={`py-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                config.transition_style === opt.value
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
