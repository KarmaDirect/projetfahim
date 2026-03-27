'use client'

import type { PortfolioBlock, PortfolioProject, PortfolioSettings } from '@/lib/types'
import PortfolioRenderer from '../renderer/PortfolioRenderer'

interface Props {
  blocks: PortfolioBlock[]
  projects: PortfolioProject[]
  settings: PortfolioSettings
}

export default function LivePreview({ blocks, projects, settings }: Props) {
  return (
    <div className="h-full overflow-auto bg-[#0F172A] rounded-2xl border border-white/5">
      <div className="origin-top-left" style={{ transform: 'scale(0.55)', width: '181.8%', transformOrigin: 'top left' }}>
        <PortfolioRenderer blocks={blocks} projects={projects} settings={settings} />
      </div>
    </div>
  )
}
