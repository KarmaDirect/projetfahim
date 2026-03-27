'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import {
  ArrowRight, ArrowLeft, Check, Users,
  Video, Palette, Film, Globe, Sparkles, Loader2,
  Crown, Briefcase, ChevronDown
} from 'lucide-react'

type Step = 0 | 1 | 2 | 3

const SPECIALTIES = [
  { id: 'monteur', label: 'Monteur Vidéo', icon: Film },
  { id: 'realisateur', label: 'Réalisateur', icon: Video },
  { id: 'agence', label: 'Agence Créative', icon: Globe },
  { id: 'freelance', label: 'Freelance Créatif', icon: Palette },
]

const VOLUME_OPTIONS = [
  { id: '1-3', label: '1 à 3 projets / mois' },
  { id: '4-10', label: '4 à 10 projets / mois' },
  { id: '10+', label: '10+ projets / mois' },
  { id: 'ponctuel', label: 'Ponctuel / Quand j\'en ai besoin' },
]

const TOOL_OPTIONS = ['Premiere Pro', 'DaVinci Resolve', 'Final Cut', 'After Effects', 'CapCut', 'Autre']

function getSpecialtyLabel(id: string) {
  return SPECIALTIES.find(s => s.id === id)?.label ?? id
}

function getVolumeLabel(id: string) {
  return VOLUME_OPTIONS.find(v => v.id === id)?.label ?? id
}

export default function PartenairePage() {
  const { profiles, signup, currentUser } = useStore()
  const router = useRouter()

  // Setup state
  const [step, setStep] = useState<Step>(0)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [monthlyVolume, setMonthlyVolume] = useState('')
  const [tools, setTools] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const partners = profiles.filter(p => p.role === 'client' && p.user_type === 'partner')

  const toggleTool = (tool: string) => {
    setTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool])
  }

  const canGoNext = () => {
    switch (step) {
      case 1: return fullName.trim() && email.trim() && password.length >= 6
      case 2: return specialty && monthlyVolume
      default: return true
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    setError('')
    const extra = {
      user_type: 'partner' as const,
      specialty,
      monthly_volume: monthlyVolume,
      tools,
      phone,
    }
    try {
      const success = await signup(email, password, fullName, company, extra)
      if (success) {
        setTimeout(() => router.push('/dashboard'), 800)
      } else {
        setError('Un compte existe déjà avec cet email.')
        setStep(1)
      }
    } catch {
      setError('Erreur lors de la création du compte. Veuillez réessayer.')
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Partenaires', 'Infos', 'Activité', 'Confirmer']

  return (
    <div className="min-h-screen bg-[#111827] text-white font-sans relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none w-screen h-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#4B5563"
          raysSpeed={0.8}
          lightSpread={0.4}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* Header */}
      <nav className="relative z-10 max-w-[1440px] mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <ArrowLeft size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          <MotionLogo className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight">Fahim AE</span>
        </Link>
        {currentUser ? (
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
            Mon Dashboard
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
            Déjà partenaire ? <span className="text-primary font-bold">Se connecter</span>
          </Link>
        )}
      </nav>

      {/* Progress Bar - visible only during setup */}
      {step > 0 && (
        <div className="relative z-10 max-w-xl mx-auto px-6 mt-2 mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${
                    i < step ? 'bg-primary border-primary text-white' :
                    i === step ? 'bg-primary/20 border-primary text-primary' :
                    'bg-white/5 border-white/10 text-gray-500'
                  }`}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    i <= step ? 'text-white' : 'text-gray-600'
                  }`}>{label}</span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-[2px] mx-3 mt-[-20px] rounded-full transition-all duration-500 ${
                    i < step ? 'bg-primary' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">

        {/* STEP 0 - Landing + Partners List */}
        {step === 0 && (
          <div>
            {/* Hero */}
            <div className="text-center pt-10 md:pt-16 mb-16">
              <div className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
                <Crown size={14} className="text-primary" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">Programme Partenaires</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6 max-w-4xl mx-auto">
                Rejoignez le réseau.<br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-500 via-primary to-gray-500">
                  Déléguez le Motion.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                Monteurs, réalisateurs, agences — devenez partenaire Fahim AE et proposez du Motion Design à vos clients sans toucher à After Effects.
              </p>

              <button
                onClick={() => setStep(1)}
                className="px-10 py-5 rounded-full bg-primary hover:bg-gray-500 text-white font-bold text-lg transition-all shadow-[0_0_40px_rgba(75,85,99,0.4)] hover:shadow-[0_0_60px_rgba(75,85,99,0.6)] hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
              >
                Devenir Partenaire
                <ArrowRight size={20} />
              </button>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {[
                { num: '01', title: 'Vendez', desc: 'Proposez des services de motion design premium à vos clients avec vos propres tarifs.' },
                { num: '02', title: 'Déléguez', desc: 'Passez commande depuis votre dashboard et suivez l\'avancement en temps réel.' },
                { num: '03', title: 'Encaissez', desc: 'Recevez les assets HD, livrez à votre client, gardez la marge. Simple.' },
              ].map(item => (
                <BorderGlow key={item.num} glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={24} glowRadius={25} glowIntensity={0.6} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
                  <div className="p-7">
                    <span className="text-primary font-black text-3xl">{item.num}</span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>

            {/* Partners List */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black">Nos Partenaires</h2>
                  <p className="text-gray-400 text-sm mt-1">{partners.length} partenaires actifs dans le réseau</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">
                  <Users size={14} />
                  {partners.length} actifs
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners.map((partner, i) => (
                  <BorderGlow
                    key={partner.id}
                    glowColor="269 80 70"
                    backgroundColor="#1F2937"
                    borderRadius={20}
                    glowRadius={20}
                    glowIntensity={0.5}
                    coneSpread={25}
                    colors={['#4B5563', '#6B7280', '#38bdf8']}
                  >
                    <div className="p-6 flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl shrink-0">
                        {partner.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg truncate">{partner.full_name}</h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-gray-500 border border-primary/30 uppercase tracking-wider shrink-0">
                            Partenaire
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{partner.company}</p>
                        <div className="flex flex-wrap gap-2">
                          {partner.specialty && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                              {getSpecialtyLabel(partner.specialty)}
                            </span>
                          )}
                          {partner.monthly_volume && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                              {getVolumeLabel(partner.monthly_volume)}
                            </span>
                          )}
                        </div>
                        {partner.tools && partner.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {partner.tools.map(tool => (
                              <span key={tool} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-gray-500">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-gray-500 font-medium">
                          Depuis {new Date(partner.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </BorderGlow>
                ))}
              </div>

              {partners.length === 0 && (
                <div className="text-center py-16">
                  <Users size={40} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Aucun partenaire pour le moment.</p>
                  <p className="text-gray-500 text-sm">Soyez le premier !</p>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-12 border-t border-white/5">
              <h3 className="text-2xl font-black mb-3">Vous aussi, rejoignez le réseau</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                L'inscription prend 2 minutes. Commencez à déléguer dès demain.
              </p>
              <button
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="px-8 py-4 rounded-full bg-white text-[#1F2937] font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-3 cursor-pointer shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
              >
                Devenir Partenaire
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 - Personal Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black mb-3">Vos informations</h1>
              <p className="text-gray-400">On a besoin de quelques détails pour créer votre espace partenaire.</p>
            </div>

            <div className="max-w-lg mx-auto">
              <BorderGlow glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={28} glowRadius={25} glowIntensity={0.6} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
                <div className="p-8 space-y-5">
                  {error && (
                    <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Nom complet *</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre nom"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Mot de passe *</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" minLength={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Entreprise / Studio</label>
                      <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Studio Montage"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Téléphone</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+33 6 ..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        )}

        {/* STEP 2 - Activity */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black mb-3">Votre activité</h1>
              <p className="text-gray-400">Pour qu'on calibre le volume et le type de projets ensemble.</p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Votre spécialité principale *</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SPECIALTIES.map(s => (
                    <button key={s.id} onClick={() => setSpecialty(s.id)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        specialty === s.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}>
                      <s.icon size={24} className="mx-auto mb-2" />
                      <span className="text-xs font-bold">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Volume estimé de motion design *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOLUME_OPTIONS.map(v => (
                    <button key={v.id} onClick={() => setMonthlyVolume(v.id)}
                      className={`px-5 py-3.5 rounded-2xl border text-left text-sm font-medium transition-all cursor-pointer ${
                        monthlyVolume === v.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Vos outils <span className="text-gray-500 font-normal text-sm">(optionnel)</span></h3>
                <div className="flex flex-wrap gap-2">
                  {TOOL_OPTIONS.map(tool => (
                    <button key={tool} onClick={() => toggleTool(tool)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                        tools.includes(tool)
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 - Confirmation */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles size={36} className="text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3">Bienvenue dans le réseau !</h1>
              <p className="text-gray-400 text-lg">Vérifiez vos infos et on est partis.</p>
            </div>

            <div className="max-w-lg mx-auto">
              <BorderGlow glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={28} glowRadius={25} glowIntensity={0.6} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
                <div className="p-8 space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl">
                      {fullName.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{fullName}</p>
                      <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-3 py-1 rounded-full bg-primary/20 text-gray-500 border border-primary/30 uppercase tracking-wider">
                      Partenaire
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    {company && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entreprise</span>
                        <span className="font-bold text-white">{company}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spécialité</span>
                      <span className="font-bold text-white">{getSpecialtyLabel(specialty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume</span>
                      <span className="font-bold text-white">{getVolumeLabel(monthlyVolume)}</span>
                    </div>
                    {tools.length > 0 && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-400">Outils</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                          {tools.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 bg-primary/20 text-gray-500 rounded-full font-bold">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={handleFinish}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-primary hover:bg-gray-500 font-bold text-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-[0_0_30px_rgba(75,85,99,0.4)]"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Rejoindre le réseau
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step > 0 && step < 3 && (
          <div className="flex items-center justify-between mt-12 max-w-2xl mx-auto">
            <button
              onClick={() => setStep((step - 1) as Step)}
              className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canGoNext()}
              className={`px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                canGoNext()
                  ? 'bg-primary hover:bg-gray-500 text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              Continuer
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft size={16} />
              Modifier mes informations
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
