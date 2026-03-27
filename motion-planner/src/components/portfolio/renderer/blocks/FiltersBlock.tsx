'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Play, Eye, Heart, Clock, TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react'
import type { PortfolioProject } from '@/lib/types'
import BlockWrapper from '../BlockWrapper'

interface Props {
  config: { enabled_filters: string[] }
  projects: PortfolioProject[]
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatDuration(s: number): string {
  if (s >= 60) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return sec > 0 ? `${m}m${sec < 10 ? '0' : ''}${sec}s` : `${m}min`
  }
  return `${s}s`
}

/* ── Video Card with KPIs ── */
function VideoCard({ project }: { project: PortfolioProject }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (project.media_type !== 'video' || !videoRef.current) return
    if (hovered) videoRef.current.play().catch(() => {})
    else videoRef.current.pause()
  }, [hovered, project.media_type])

  const hasKpis = project.views || project.likes || project.retention_rate

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Media ── */}
      <div className={`relative w-full ${project.format === 'short' ? 'aspect-[9/14]' : 'aspect-[16/10]'} rounded-[24px] overflow-hidden bg-[#111118] ring-1 ring-white/[0.06] group-hover:ring-primary/40 transition-all duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(75,85,99,0.35)]`}>
        {project.media_type === 'video' ? (
          <>
            <img
              src={project.thumbnail_url || project.media_url}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}
            />
            <video
              ref={videoRef}
              src={project.media_url}
              className="absolute inset-0 w-full h-full object-cover"
              loop muted playsInline
            />
          </>
        ) : (
          <img
            src={project.media_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
        )}

        {/* Duration badge */}
        {project.duration_seconds && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white tabular-nums">
            {formatDuration(project.duration_seconds)}
          </div>
        )}

        {/* Platform badge */}
        {project.platform && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
            {project.platform}
          </div>
        )}

        {/* Play overlay (video only, before hover) */}
        {project.media_type === 'video' && !hovered && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {project.description && (
              <p className="text-[11px] text-gray-300 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {project.software_used?.slice(0, 3).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white/80">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Info + KPIs ── */}
      <div className="mt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white truncate group-hover:text-gray-500 transition-colors">{project.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
              <span className="text-gray-500 uppercase tracking-widest">{project.category}</span>
              <span className="text-white/20">/</span>
              <span className="text-gray-500">{project.client}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-all shrink-0 hover:bg-primary hover:border-primary">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* KPI Row */}
        {hasKpis && (
          <div className="mt-3 flex items-center gap-1 flex-wrap">
            {project.views !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Eye size={11} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{formatNumber(project.views)}</span>
              </div>
            )}
            {project.likes !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Heart size={11} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{formatNumber(project.likes)}</span>
              </div>
            )}
            {project.watch_time_avg !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Clock size={11} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{formatDuration(project.watch_time_avg)} moy.</span>
              </div>
            )}
            {project.ctr !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <TrendingUp size={11} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{project.ctr}% CTR</span>
              </div>
            )}
            {project.retention_rate !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <BarChart3 size={11} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{project.retention_rate}% rét.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── KPI Scroll Strip ── */
function KpiStrip({ projects }: { projects: PortfolioProject[] }) {
  const totalViews = projects.reduce((s, p) => s + (p.views || 0), 0)
  const totalLikes = projects.reduce((s, p) => s + (p.likes || 0), 0)
  const avgRetention = projects.filter(p => p.retention_rate).length > 0
    ? Math.round(projects.reduce((s, p) => s + (p.retention_rate || 0), 0) / projects.filter(p => p.retention_rate).length)
    : null
  const avgCtr = projects.filter(p => p.ctr).length > 0
    ? (projects.reduce((s, p) => s + (p.ctr || 0), 0) / projects.filter(p => p.ctr).length).toFixed(1)
    : null

  if (!totalViews && !totalLikes) return null

  const kpis = [
    { value: formatNumber(totalViews), label: 'Vues totales', icon: <Eye size={18} />, color: 'from-primary/20 to-gray-500/10', iconColor: 'text-gray-500', accent: 'border-primary/20' },
    { value: formatNumber(totalLikes), label: 'Likes totaux', icon: <Heart size={18} />, color: 'from-rose-500/20 to-rose-500/5', iconColor: 'text-rose-400', accent: 'border-rose-500/20' },
    ...(avgRetention ? [{ value: `${avgRetention}%`, label: 'Rétention moy.', icon: <BarChart3 size={18} />, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', accent: 'border-emerald-500/20' }] : []),
    ...(avgCtr ? [{ value: `${avgCtr}%`, label: 'CTR moyen', icon: <TrendingUp size={18} />, color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', accent: 'border-amber-500/20' }] : []),
    { value: String(projects.length), label: 'Projets', icon: <Play size={18} className="fill-current" />, color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', accent: 'border-blue-500/20' },
  ]

  return (
    <div className="mb-12 -mx-6 px-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`snap-start shrink-0 w-44 bg-gradient-to-br ${kpi.color} border ${kpi.accent} rounded-2xl p-5 relative overflow-hidden`}
          >
            <div className={`${kpi.iconColor} mb-3 opacity-60`}>{kpi.icon}</div>
            <p className="text-3xl font-black text-white tabular-nums tracking-tight">{kpi.value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main Block ── */
export default function FiltersBlock({ config, projects }: Props) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filterOptions = useMemo(() => {
    const opts: Record<string, Set<string>> = {}
    const filterMap: Record<string, (p: PortfolioProject) => string | string[] | undefined> = {
      type: p => p.category,
      format: p => p.format === 'long' ? 'Horizontal' : 'Vertical',
      style: p => p.style,
      audience: p => p.audience,
      software: p => p.software_used,
    }
    for (const f of config.enabled_filters) {
      opts[f] = new Set()
      for (const p of projects) {
        const val = filterMap[f]?.(p)
        if (Array.isArray(val)) val.forEach(v => opts[f].add(v))
        else if (val) opts[f].add(val)
      }
    }
    return opts
  }, [config.enabled_filters, projects])

  const filtered = useMemo(() => {
    return projects.filter(p => {
      for (const [key, val] of Object.entries(activeFilters)) {
        if (!val) continue
        if (key === 'type' && p.category !== val) return false
        if (key === 'format' && (p.format === 'long' ? 'Horizontal' : 'Vertical') !== val) return false
        if (key === 'style' && p.style !== val) return false
        if (key === 'audience' && p.audience !== val) return false
        if (key === 'software' && (!p.software_used || !p.software_used.includes(val))) return false
      }
      return true
    })
  }, [projects, activeFilters])

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }))
  }

  const activeCount = Object.values(activeFilters).filter(Boolean).length

  const filterLabels: Record<string, string> = {
    type: 'Type', format: 'Format', style: 'Style', audience: 'Audience', software: 'Logiciel'
  }

  return (
    <BlockWrapper>
      {/* ── Filter bar ── */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl md:text-4xl font-black">Projets</h2>
          {activeCount > 0 && (
            <button
              onClick={() => setActiveFilters({})}
              className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              Effacer les filtres ({activeCount})
            </button>
          )}
        </div>

        {/* Inline filters */}
        <div className="flex flex-wrap gap-2">
          {config.enabled_filters.map(f => {
            const values = filterOptions[f]
            if (!values || values.size === 0) return null
            return Array.from(values).map(val => (
              <button
                key={`${f}-${val}`}
                onClick={() => toggleFilter(f, val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilters[f] === val
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(75,85,99,0.3)]'
                    : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-[9px] text-gray-500 uppercase tracking-wider mr-1.5">{filterLabels[f]}</span>
                {val}
              </button>
            ))
          })}
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <KpiStrip projects={filtered} />

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {filtered.map(project => (
          <div
            key={project.id}
            className={project.format === 'long' ? 'md:col-span-2' : 'col-span-1'}
          >
            <VideoCard project={project} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-gray-500">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Play size={24} className="text-gray-600" />
          </div>
          <p className="text-lg font-bold text-white mb-1">Aucun projet trouvé</p>
          <p className="text-sm text-gray-500">Essayez d'autres filtres</p>
        </div>
      )}
    </BlockWrapper>
  )
}
