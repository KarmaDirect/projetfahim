'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import type { PortfolioBlock, PortfolioProject, PortfolioSettings } from '@/lib/types'
import ShowreelBlock from './blocks/ShowreelBlock'
import BeforeAfterBlock from './blocks/BeforeAfterBlock'
import FiltersBlock from './blocks/FiltersBlock'
import TestimonialBlock from './blocks/TestimonialBlock'
import TechStackBlock from './blocks/TechStackBlock'
import AvailabilityBlock from './blocks/AvailabilityBlock'

interface Props {
  blocks: PortfolioBlock[]
  projects: PortfolioProject[]
  settings: PortfolioSettings
}

export default function PortfolioRenderer({ blocks, projects, settings }: Props) {
  const enabledBlocks = [...blocks]
    .filter(b => b.enabled)
    .sort((a, b) => a.order - b.order)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (musicPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setMusicPlaying(!musicPlaying)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Audio */}
      {settings.ambient_music_url && (
        <audio ref={audioRef} src={settings.ambient_music_url} loop />
      )}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0F172A]/80 border-b border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Retour</span>
          </Link>
          <div className="flex items-center gap-3">
            {settings.ambient_music_url && (
              <button onClick={toggleMusic} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                {musicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} className="text-gray-500" />}
              </button>
            )}
            {settings.cta_text && settings.cta_url && (
              <a
                href={settings.cta_url}
                className="px-5 py-2.5 bg-primary hover:bg-[#5A47E6] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#4B5563]/20"
              >
                {settings.cta_text}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative py-24 md:py-36 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black mb-5 tracking-tight leading-[0.95]">
            <span className="bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
              {settings.hero_title || 'Portfolio'}
            </span>
          </h1>
          {settings.hero_subtitle && (
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">{settings.hero_subtitle}</p>
          )}
        </div>
      </header>

      {/* ── Blocks ── */}
      {enabledBlocks.map(block => {
        const cfg = block.config as Record<string, unknown>
        switch (block.type) {
          case 'showreel':
            return <ShowreelBlock key={block.id} config={cfg as never} projects={projects} />
          case 'before_after':
            return <BeforeAfterBlock key={block.id} config={cfg as never} />
          case 'filters':
            return <FiltersBlock key={block.id} config={cfg as never} projects={projects} />
          case 'testimonial':
            return <TestimonialBlock key={block.id} config={cfg as never} />
          case 'tech_stack':
            return <TechStackBlock key={block.id} config={cfg as never} />
          case 'availability_widget':
            return <AvailabilityBlock key={block.id} config={cfg as never} />
          default:
            return null
        }
      })}

      {/* ── Footer ── */}
      <footer className="py-16 px-6 text-center border-t border-white/[0.04]">
        <p className="text-sm text-gray-600">Portfolio propulsé par <span className="text-[#6B7280] font-bold">Fahim AE</span></p>
      </footer>
    </div>
  )
}
