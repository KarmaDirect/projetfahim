'use client'

import { Plus, Trash2, Star } from 'lucide-react'
import type { ProjectTestimonial } from '@/lib/types'

interface Props {
  config: { testimonials: ProjectTestimonial[] }
  onChange: (config: Record<string, unknown>) => void
}

export default function TestimonialConfig({ config, onChange }: Props) {
  const updateTestimonial = (id: string, updates: Partial<ProjectTestimonial>) => {
    onChange({ testimonials: config.testimonials.map(t => t.id === id ? { ...t, ...updates } : t) })
  }

  const addTestimonial = () => {
    onChange({
      testimonials: [...config.testimonials, {
        id: `test-${Date.now()}`,
        project_id: '',
        client_name: '',
        client_photo_url: '',
        client_role: '',
        quote: '',
        scores: [{ label: 'Qualité', value: 5 }, { label: 'Délai', value: 5 }],
      }],
    })
  }

  const removeTestimonial = (id: string) => {
    onChange({ testimonials: config.testimonials.filter(t => t.id !== id) })
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-gray-500 block">Témoignages de vos clients</label>
      {config.testimonials.map((t, idx) => (
        <div key={t.id} className="bg-[#FAFBFC] rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                {t.client_name ? t.client_name.charAt(0).toUpperCase() : (idx + 1)}
              </div>
              <span className="text-xs font-bold text-gray-500">Témoignage {idx + 1}</span>
            </div>
            <button onClick={() => removeTestimonial(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={t.client_name}
              onChange={e => updateTestimonial(t.id, { client_name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-bold focus:border-primary focus:outline-none"
              placeholder="Nom"
            />
            <input
              value={t.client_role}
              onChange={e => updateTestimonial(t.id, { client_role: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm focus:border-primary focus:outline-none"
              placeholder="Rôle — Entreprise"
            />
          </div>
          <textarea
            value={t.quote}
            onChange={e => updateTestimonial(t.id, { quote: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm focus:border-primary focus:outline-none resize-none"
            placeholder="« Ce qu'ils ont dit de votre travail... »"
          />
          {/* Mini star preview */}
          <div className="flex items-center gap-1">
            {t.scores.slice(0, 3).map((s, si) => (
              <span key={si} className="flex items-center gap-0.5 text-[10px] text-gray-400">
                <Star size={10} className="text-amber-400 fill-amber-400" /> {s.label}: {s.value}/5
                {si < Math.min(t.scores.length, 3) - 1 && <span className="mx-1">&middot;</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addTestimonial} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-300 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
        <Plus size={14} /> Ajouter un témoignage
      </button>
    </div>
  )
}
