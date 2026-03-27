'use client'

import { useStore } from '@/lib/store'
import PortfolioRenderer from '@/components/portfolio/renderer/PortfolioRenderer'

export default function PortfolioPage() {
  const { portfolioBlocks, portfolioProjects, portfolioSettings } = useStore()

  return (
    <PortfolioRenderer
      blocks={portfolioBlocks}
      projects={portfolioProjects}
      settings={portfolioSettings}
    />
  )
}
