'use client'

import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'

interface Item {
  id: string
  before_url: string
  after_url: string
  label: string
}

interface Props {
  config: { items: Item[] }
  onChange: (config: Record<string, unknown>) => void
}

export default function BeforeAfterConfig({ config, onChange }: Props) {
  const updateItem = (id: string, updates: Partial<Item>) => {
    onChange({ items: config.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }

  const addItem = () => {
    onChange({ items: [...config.items, { id: `ba-${Date.now()}`, before_url: '', after_url: '', label: '' }] })
  }

  const removeItem = (id: string) => {
    onChange({ items: config.items.filter(i => i.id !== id) })
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-gray-500 block">Ajoutez des comparaisons avant/après</label>
      {config.items.map((item, idx) => (
        <div key={item.id} className="bg-[#FAFBFC] rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Comparaison {idx + 1}</span>
            <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={14} /></button>
          </div>
          <input
            value={item.label}
            onChange={e => updateItem(item.id, { label: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-bold focus:border-primary focus:outline-none"
            placeholder="Nom de la comparaison"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Avant</label>
              <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-100 px-3 py-2">
                <ImageIcon size={12} className="text-gray-300 shrink-0" />
                <input
                  value={item.before_url}
                  onChange={e => updateItem(item.id, { before_url: e.target.value })}
                  className="w-full text-[11px] focus:outline-none"
                  placeholder="URL image avant"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Après</label>
              <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-100 px-3 py-2">
                <ImageIcon size={12} className="text-gray-300 shrink-0" />
                <input
                  value={item.after_url}
                  onChange={e => updateItem(item.id, { after_url: e.target.value })}
                  className="w-full text-[11px] focus:outline-none"
                  placeholder="URL image après"
                />
              </div>
            </div>
          </div>
          {/* Mini preview */}
          {item.before_url && item.after_url && (
            <div className="grid grid-cols-2 gap-2">
              <img src={item.before_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
              <img src={item.after_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
            </div>
          )}
        </div>
      ))}
      <button onClick={addItem} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-300 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
        <Plus size={14} /> Ajouter une comparaison
      </button>
    </div>
  )
}
