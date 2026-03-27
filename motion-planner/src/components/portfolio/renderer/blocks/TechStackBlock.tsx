'use client'

import type { TechTool } from '@/lib/types'
import BlockWrapper from '../BlockWrapper'

interface Props {
  config: { tools: TechTool[] }
}

export default function TechStackBlock({ config }: Props) {
  if (!config.tools || config.tools.length === 0) return null

  const categories = [...new Set(config.tools.map(t => t.category))]

  return (
    <BlockWrapper>
      <h2 className="text-3xl md:text-4xl font-black mb-2">Stack technique</h2>
      <p className="text-gray-400 mb-10">Outils maîtrisés et projets réalisés.</p>

      <div className="space-y-10">
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{cat}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.tools
                .filter(t => t.category === cat)
                .map(tool => (
                  <div key={tool.id} className="bg-[#1F2937] border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-gray-500">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold group-hover:text-gray-500 transition-colors">{tool.name}</p>
                        <p className="text-[10px] text-gray-500">{tool.project_count} projets</p>
                      </div>
                    </div>
                    {/* Proficiency bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-primary to-gray-500 transition-all duration-700"
                          style={{ width: `${(tool.proficiency / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{tool.proficiency}/5</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
