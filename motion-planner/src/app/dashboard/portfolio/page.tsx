'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import BlockList from '@/components/portfolio/editor/BlockList'
import BlockConfigPanel from '@/components/portfolio/editor/BlockConfigPanel'
import LivePreview from '@/components/portfolio/editor/LivePreview'
import { BLOCK_REGISTRY } from '@/lib/block-registry'
import type { PortfolioBlockType } from '@/lib/types'
import { Plus, Eye, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioEditorPage() {
  const {
    portfolioBlocks,
    portfolioProjects,
    portfolioSettings,
    addBlock,
    removeBlock,
    updateBlockConfig,
    toggleBlock,
    reorderBlock,
  } = useStore()

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const selectedBlock = portfolioBlocks.find(b => b.id === selectedBlockId) || null

  const availableBlocks = Object.values(BLOCK_REGISTRY).filter(
    meta => meta.phase === 1 && !meta.dashboardOnly
  )

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Éditeur Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Personnalisez les blocs de votre portfolio public</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/portfolio"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Eye className="w-4 h-4" />
            Aperçu
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Block List */}
        <div className="w-72 border-r border-gray-100 bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Blocs</h2>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddMenu && (
              <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
                {availableBlocks.map(meta => (
                  <button
                    key={meta.type}
                    onClick={() => {
                      addBlock(meta.type as PortfolioBlockType)
                      setShowAddMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <p className="font-medium text-gray-900">{meta.label}</p>
                    <p className="text-gray-500 mt-0.5">{meta.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <BlockList
              blocks={portfolioBlocks}
              selectedId={selectedBlockId}
              onSelect={setSelectedBlockId}
              onToggle={toggleBlock}
              onReorder={reorderBlock}
              onRemove={removeBlock}
            />
          </div>
        </div>

        {/* Center - Live Preview */}
        <div className="flex-1 bg-gray-50 p-6 overflow-hidden">
          <div className="h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <LivePreview
              blocks={portfolioBlocks}
              projects={portfolioProjects}
              settings={portfolioSettings}
            />
          </div>
        </div>

        {/* Right Panel - Config */}
        <div className="w-80 border-l border-gray-100 bg-white overflow-y-auto">
          <div className="p-6">
            {selectedBlock ? (
              <>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Configuration</h2>
                <BlockConfigPanel
                  block={selectedBlock}
                  onConfigChange={updateBlockConfig}
                />
              </>
            ) : (
              <div className="text-center text-gray-400 text-sm mt-12">
                <p>Sélectionnez un bloc pour le configurer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
