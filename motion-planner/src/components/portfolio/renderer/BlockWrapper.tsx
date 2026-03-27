'use client'

import type { ReactNode } from 'react'

export default function BlockWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-20 px-6 ${className}`}>
      <div className="max-w-[1440px] mx-auto">
        {children}
      </div>
    </section>
  )
}
