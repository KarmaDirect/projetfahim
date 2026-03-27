'use client'

import type { PortfolioBlock } from '@/lib/types'
import ShowreelConfig from './configs/ShowreelConfig'
import FiltersConfig from './configs/FiltersConfig'
import BeforeAfterConfig from './configs/BeforeAfterConfig'
import TestimonialConfig from './configs/TestimonialConfig'
import TechStackConfigPanel from './configs/TechStackConfig'
import AvailabilityConfig from './configs/AvailabilityConfig'

interface Props {
  block: PortfolioBlock
  onConfigChange: (blockId: string, config: Record<string, unknown>) => void
}

export default function BlockConfigPanel({ block, onConfigChange }: Props) {
  const onChange = (config: Record<string, unknown>) => onConfigChange(block.id, config)
  const cfg = block.config as Record<string, unknown>

  return (
    <div>
      {block.type === 'showreel' && <ShowreelConfig config={cfg as never} onChange={onChange} />}
      {block.type === 'filters' && <FiltersConfig config={cfg as never} onChange={onChange} />}
      {block.type === 'before_after' && <BeforeAfterConfig config={cfg as never} onChange={onChange} />}
      {block.type === 'testimonial' && <TestimonialConfig config={cfg as never} onChange={onChange} />}
      {block.type === 'tech_stack' && <TechStackConfigPanel config={cfg as never} onChange={onChange} />}
      {block.type === 'availability_widget' && <AvailabilityConfig config={cfg as never} onChange={onChange} />}
    </div>
  )
}
