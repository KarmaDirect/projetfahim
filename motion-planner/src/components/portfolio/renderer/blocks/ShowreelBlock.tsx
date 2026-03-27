'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PortfolioProject } from '@/lib/types'
import BlockWrapper from '../BlockWrapper'
import { Play } from 'lucide-react'

interface Props {
  config: { clip_duration_seconds: number; transition_style: string; project_ids: string[] }
  projects: PortfolioProject[]
}

export default function ShowreelBlock({ config, projects }: Props) {
  const items = config.project_ids.length > 0
    ? projects.filter(p => config.project_ids.includes(p.id))
    : projects

  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Progress bar animation
  useEffect(() => {
    let startTime = Date.now()
    const duration = (config.clip_duration_seconds || 3) * 1000
    let animationFrameId: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const percent = Math.min((elapsed / duration) * 100, 100)
      setProgress(percent)
      if (percent < 100) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      setProgress(0)
      cancelAnimationFrame(animationFrameId)
    }
  }, [current, config.clip_duration_seconds])

  const advance = useCallback(() => {
    if (items.length <= 1) return
    setFading(true)
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % items.length)
      setFading(false)
    }, config.transition_style === 'cut' ? 50 : 600)
  }, [items.length, config.transition_style])

  useEffect(() => {
    const interval = setInterval(advance, (config.clip_duration_seconds || 3) * 1000)
    return () => clearInterval(interval)
  }, [advance, config.clip_duration_seconds])

  if (items.length === 0) return null

  const item = items[current]

  return (
    <BlockWrapper>
      <div className="relative w-full aspect-video rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#0F172A] group group/showreel shadow-[0_0_100px_-20px_rgba(75,85,99,0.4)] ring-1 ring-white/10">
        
        {/* Cinematic Blur Background effect */}
        <div className="absolute inset-0 blur-[100px] scale-150 opacity-40 mix-blend-screen pointer-events-none">
          <img src={item.media_url} alt="blur" className="w-full h-full object-cover" />
        </div>

        {/* Media */}
        <div className="relative w-full h-full z-10 transition-transform duration-[10s] ease-out scale-100 group-hover/showreel:scale-105">
          {item.media_type === 'video' ? (
            <video
              key={item.id}
              src={item.media_url}
              className={`w-full h-full object-cover transition-opacity ${config.transition_style === 'cut' ? 'duration-75' : 'duration-700'} ${fading ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              key={item.id}
              src={item.media_url}
              alt={item.title}
              className={`w-full h-full object-cover transition-opacity ${config.transition_style === 'cut' ? 'duration-75' : 'duration-700'} ${fading ? 'opacity-0 scale-110 blur-md' : 'opacity-100 scale-100 blur-0'}`}
            />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-14 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500">
          <div className="flex items-end justify-between w-full translate-y-4 group-hover/showreel:translate-y-0 transition-transform duration-500">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[#6B7280] text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2">
                  <Play size={10} className="fill-[#6B7280]" /> Showreel
                </span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{item.client}</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white hover:text-primary transition-colors leading-tight mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-xl line-clamp-2 md:line-clamp-none drop-shadow-lg">
                  {item.description}
                </p>
              )}
            </div>
            
            <div className="hidden md:flex mb-2 flex-col items-end gap-3 shrink-0">
               {/* Timeline indicators */}
               <div className="flex gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-xl">
                 {items.map((_, i) => (
                   <button
                     key={i}
                     onClick={() => { setCurrent(i); setFading(false) }}
                     className={`h-2 rounded-full transition-all duration-500 cursor-pointer relative overflow-hidden ${i === current ? 'w-16 bg-white/20' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                   >
                     {i === current && (
                       <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: `${progress}%` }}></div>
                     )}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

      </div>
    </BlockWrapper>
  )
}
