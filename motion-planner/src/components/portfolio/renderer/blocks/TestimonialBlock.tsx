'use client'

import { Star } from 'lucide-react'
import type { ProjectTestimonial } from '@/lib/types'
import BlockWrapper from '../BlockWrapper'

interface Props {
  config: { testimonials: ProjectTestimonial[] }
}

export default function TestimonialBlock({ config }: Props) {
  if (!config.testimonials || config.testimonials.length === 0) return null

  return (
    <BlockWrapper>
      <h2 className="text-3xl md:text-4xl font-black mb-2">Ce qu'ils en disent</h2>
      <p className="text-gray-400 mb-10">Retours clients sur chaque projet.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.testimonials.map(t => (
          <div key={t.id} className="bg-[#1F2937] border border-white/10 rounded-[28px] p-8 hover:border-primary/30 transition-colors">
            {/* Scores */}
            <div className="flex flex-wrap gap-4 mb-6">
              {t.scores.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < s.value ? 'text-[#FFBD2E] fill-[#FFBD2E]' : 'text-gray-600'} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-300 italic text-lg leading-relaxed mb-6">"{t.quote}"</p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-6 border-t border-white/10">
              <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {t.client_name.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{t.client_name}</p>
                <p className="text-xs text-gray-500">{t.client_role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
