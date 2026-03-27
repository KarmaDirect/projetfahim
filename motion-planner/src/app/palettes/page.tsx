'use client'

import { useState } from 'react'
import { Play, Eye, Heart, Star, Clock, ArrowUpRight, Filter, Check, TrendingUp, ChevronRight } from 'lucide-react'

interface Palette {
  name: string
  description: string
  primary: string
  primaryLight: string
  primaryGlow: string
  accent: string
  accentLight: string
  bg: string
  bgCard: string
  bgSurface: string
}

const PALETTES: Palette[] = [
  {
    name: 'Violet Électrique',
    description: 'Actuelle — Tech / IA vibes',
    primary: '#4B5563',
    primaryLight: '#6B7280',
    primaryGlow: 'rgba(75,85,99,0.25)',
    accent: '#FFBD2E',
    accentLight: '#FFD76B',
    bg: '#0F172A',
    bgCard: '#111118',
    bgSurface: '#16161F',
  },
  {
    name: 'Midnight Blue',
    description: 'Pro & créatif — Studio haut de gamme',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryGlow: 'rgba(59,130,246,0.2)',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    bg: '#0B0F1A',
    bgCard: '#111827',
    bgSurface: '#1E293B',
  },
  {
    name: 'Coral Sunset',
    description: 'Chaleureux & créatif — Motion design',
    primary: '#F43F5E',
    primaryLight: '#FB7185',
    primaryGlow: 'rgba(244,63,94,0.2)',
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    bg: '#0F0A0A',
    bgCard: '#1A1111',
    bgSurface: '#231818',
  },
  {
    name: 'Emerald Studio',
    description: 'Fresh & moderne — Agence créative',
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryGlow: 'rgba(16,185,129,0.2)',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    bg: '#080F0C',
    bgCard: '#0F1A16',
    bgSurface: '#162B23',
  },
  {
    name: 'Obsidian',
    description: 'Minimal & premium — Portfolio luxe',
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryGlow: 'rgba(167,139,250,0.15)',
    accent: '#FB923C',
    accentLight: '#FDBA74',
    bg: '#09090B',
    bgCard: '#121215',
    bgSurface: '#1C1C21',
  },
  {
    name: 'Electric Cyan',
    description: 'Futuriste — Motion / VFX',
    primary: '#06B6D4',
    primaryLight: '#22D3EE',
    primaryGlow: 'rgba(6,182,212,0.2)',
    accent: '#F43F5E',
    accentLight: '#FB7185',
    bg: '#060E11',
    bgCard: '#0C1A1F',
    bgSurface: '#132830',
  },
]

function PalettePreview({ palette, index }: { palette: Palette; index: number }) {
  return (
    <section id={`palette${index + 1}`} className="scroll-mt-24">
      <div className="rounded-[32px] overflow-hidden border border-white/[0.06]" style={{ background: palette.bg }}>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: palette.primary }}>Palette {index + 1}</span>
              <span className="w-3 h-3 rounded-full" style={{ background: palette.primary }} />
              <span className="w-3 h-3 rounded-full" style={{ background: palette.primaryLight }} />
              <span className="w-3 h-3 rounded-full" style={{ background: palette.accent }} />
            </div>
            <h2 className="text-2xl font-black text-white">{palette.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{palette.description}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono" style={{ background: palette.bgCard, color: palette.primary, border: `1px solid ${palette.primary}30` }}>{palette.primary}</span>
            <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono" style={{ background: palette.bgCard, color: palette.accent, border: `1px solid ${palette.accent}30` }}>{palette.accent}</span>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">

          {/* ── Hero preview ── */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden" style={{ background: palette.bgSurface }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${palette.primaryGlow}, transparent 70%)` }} />
            <div className="relative">
              <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Travaux Récents.</h3>
              <p className="text-gray-500 text-sm mb-5">Motion design pour partenaires & agences</p>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors" style={{ background: palette.primary, boxShadow: `0 8px 24px ${palette.primaryGlow}` }}>
                Lancer un projet
              </button>
            </div>
          </div>

          {/* ── KPI Strip ── */}
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { value: '2.1M', label: 'Vues', icon: <Eye size={16} /> },
              { value: '79.4K', label: 'Likes', icon: <Heart size={16} /> },
              { value: '80%', label: 'Rétention', icon: <TrendingUp size={16} /> },
              { value: '9.9%', label: 'CTR', icon: <Play size={16} /> },
            ].map((kpi, i) => (
              <div key={i} className="shrink-0 w-36 rounded-2xl p-4 border" style={{ background: `${palette.primary}08`, borderColor: `${palette.primary}15` }}>
                <div className="mb-2 opacity-50" style={{ color: palette.primaryLight }}>{kpi.icon}</div>
                <p className="text-2xl font-black text-white tabular-nums">{kpi.value}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* ── Cards + Filters ── */}
          <div className="flex gap-3 flex-wrap mb-2">
            {['Tous', '3D Cinématique', 'Motion App', 'Flat Design'].map((f, i) => (
              <button
                key={f}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={i === 1 ? {
                  background: palette.primary,
                  color: 'white',
                  boxShadow: `0 4px 16px ${palette.primaryGlow}`,
                } : {
                  background: `${palette.primary}08`,
                  border: `1px solid ${palette.primary}15`,
                  color: '#9CA3AF',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Card 1 - Long */}
            <div className="col-span-2 group cursor-pointer">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden" style={{ background: palette.bgCard, border: `1px solid ${palette.primary}10` }}>
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>0:30</div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>YouTube</div>
              </div>
              <div className="mt-3 px-1">
                <p className="text-sm font-black text-white">Campagne Nike Air</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: palette.primaryLight }}>Publicité 3D</span>
                  <span className="text-white/20 text-[10px]">/</span>
                  <span className="text-[10px] text-gray-500 font-bold">Fuze</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[
                    { icon: <Eye size={9} />, val: '284K' },
                    { icon: <Heart size={9} />, val: '12.4K' },
                    { icon: <Clock size={9} />, val: '24s' },
                  ].map((k, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: `${palette.primary}08`, border: `1px solid ${palette.primary}10` }}>
                      <span style={{ color: palette.primaryLight }} className="opacity-60">{k.icon}</span>
                      <span className="text-[9px] font-bold text-gray-400 tabular-nums">{k.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 - Short */}
            <div className="col-span-1 group cursor-pointer">
              <div className="relative aspect-[9/14] rounded-2xl overflow-hidden" style={{ background: palette.bgCard, border: `1px solid ${palette.primary}10` }}>
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>0:15</div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>TikTok</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
                    <Play size={14} className="fill-white ml-0.5 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-3 px-1">
                <p className="text-sm font-black text-white">Short TikTok Viral</p>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: palette.primaryLight }}>Motion App</span>
                <div className="flex gap-1 mt-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: `${palette.primary}08`, border: `1px solid ${palette.primary}10` }}>
                    <Eye size={9} style={{ color: palette.primaryLight }} className="opacity-60" />
                    <span className="text-[9px] font-bold text-gray-400 tabular-nums">1.2M</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: `${palette.primary}08`, border: `1px solid ${palette.primary}10` }}>
                    <Heart size={9} style={{ color: palette.primaryLight }} className="opacity-60" />
                    <span className="text-[9px] font-bold text-gray-400 tabular-nums">89K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Testimonial + Availability ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ background: palette.bgCard, borderColor: `${palette.primary}12` }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: palette.accent, fill: s <= 4 ? palette.accent : 'transparent' }} />)}
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed mb-4">&laquo; Le rendu 3D a dépassé nos attentes. &raquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${palette.primary}20`, color: palette.primaryLight }}>J</div>
                <div>
                  <p className="text-xs font-bold text-white">Julien</p>
                  <p className="text-[10px] text-gray-500">Directeur Créatif</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-5 border" style={{ background: `${palette.primary}06`, borderColor: `${palette.primary}15` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#10B981' }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#10B981' }} />
                </span>
                <span className="text-xs font-bold text-emerald-400">Disponible</span>
              </div>
              <p className="text-2xl font-black text-white mb-1">5 jours</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Délai moyen de livraison</p>
            </div>
          </div>

          {/* ── Navbar preview ── */}
          <div className="rounded-2xl p-4 flex items-center justify-between border" style={{ background: `${palette.bg}CC`, borderColor: `${palette.primary}10` }}>
            <span className="text-sm font-bold text-gray-500">← Retour</span>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500">♪</span>
              <button className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: palette.primary }}>Lancer un projet</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PalettesPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050507]/90 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-black">Palettes Fahim AE</h1>
          <div className="flex gap-2">
            {PALETTES.map((p, i) => (
              <a
                key={i}
                href={`#palette${i + 1}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/5"
                style={{ color: p.primary }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.primary }} />
                {i + 1}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-3">Choix de la palette</h1>
          <p className="text-gray-500 text-sm">Compare les 6 options sur les mêmes composants du portfolio</p>
        </div>

        {PALETTES.map((p, i) => (
          <PalettePreview key={i} palette={p} index={i} />
        ))}
      </div>
    </div>
  )
}
