'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { TechTool } from '@/lib/types'

interface Props {
  config: { tools: TechTool[] }
  onChange: (config: Record<string, unknown>) => void
}

export default function TechStackConfigPanel({ config, onChange }: Props) {
  const updateTool = (id: string, updates: Partial<TechTool>) => {
    onChange({ tools: config.tools.map(t => t.id === id ? { ...t, ...updates } : t) })
  }

  const addTool = () => {
    onChange({
      tools: [...config.tools, {
        id: `tool-${Date.now()}`,
        name: '',
        icon_url: '',
        category: '',
        proficiency: 3,
        project_count: 0,
      }],
    })
  }

  const removeTool = (id: string) => {
    onChange({ tools: config.tools.filter(t => t.id !== id) })
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-gray-500 block">Vos outils et niveaux de maîtrise</label>
      {config.tools.map(tool => (
        <div key={tool.id} className="bg-[#FAFBFC] rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                {tool.name ? tool.name.charAt(0) : '?'}
              </div>
              <input
                value={tool.name}
                onChange={e => updateTool(tool.id, { name: e.target.value })}
                className="bg-transparent text-sm font-bold focus:outline-none text-[#1F2937] placeholder-gray-300"
                placeholder="Nom de l'outil"
              />
            </div>
            <button onClick={() => removeTool(tool.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={tool.category}
              onChange={e => updateTool(tool.id, { category: e.target.value })}
              className="px-3 py-2 rounded-xl bg-white border border-gray-100 text-xs focus:border-primary focus:outline-none"
              placeholder="Catégorie (3D, Montage...)"
            />
            <input
              type="number"
              min={0}
              value={tool.project_count}
              onChange={e => updateTool(tool.id, { project_count: Number(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-white border border-gray-100 text-xs focus:border-primary focus:outline-none"
              placeholder="Nb projets"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-gray-400">Maîtrise</label>
              <span className="text-[10px] font-bold text-primary">{tool.proficiency}/5</span>
            </div>
            <div className="flex gap-1.5">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => updateTool(tool.id, { proficiency: n })}
                  className={`flex-1 h-2 rounded-full transition-colors cursor-pointer ${
                    n <= tool.proficiency ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <button onClick={addTool} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-300 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
        <Plus size={14} /> Ajouter un outil
      </button>
    </div>
  )
}
