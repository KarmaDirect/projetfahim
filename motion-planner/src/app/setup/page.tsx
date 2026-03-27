'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import {
  ArrowRight, ArrowLeft, Check, Users, Briefcase,
  Video, Palette, Film, Globe, Sparkles, Loader2,
  Monitor, Smartphone, Layers, Wand2
} from 'lucide-react'

type UserType = 'partner' | 'client_direct'
type Step = 1 | 2 | 3 | 4

const SPECIALTIES = [
  { id: 'monteur', label: 'Monteur Vidéo', icon: Film },
  { id: 'realisateur', label: 'Réalisateur', icon: Video },
  { id: 'agence', label: 'Agence Créative', icon: Globe },
  { id: 'freelance', label: 'Freelance Créatif', icon: Palette },
]

const PROJECT_TYPES = [
  { id: 'intro_outro', label: 'Intros / Outros', icon: Sparkles },
  { id: 'motion_branding', label: 'Motion Branding', icon: Wand2 },
  { id: 'social_media', label: 'Social Media', icon: Smartphone },
  { id: 'presentation', label: 'Présentations', icon: Monitor },
  { id: 'video_editing', label: 'Habillage Vidéo', icon: Layers },
  { id: 'full_animation', label: 'Animation Complète', icon: Film },
]

const VOLUME_OPTIONS = [
  { id: '1-3', label: '1 à 3 projets / mois' },
  { id: '4-10', label: '4 à 10 projets / mois' },
  { id: '10+', label: '10+ projets / mois' },
  { id: 'ponctuel', label: 'Ponctuel / Quand j\'en ai besoin' },
]

const BUDGET_OPTIONS = [
  { id: '< 500', label: 'Moins de 500 €' },
  { id: '500-1500', label: '500 € - 1 500 €' },
  { id: '1500-5000', label: '1 500 € - 5 000 €' },
  { id: '5000+', label: '5 000 € et plus' },
  { id: 'variable', label: 'Variable selon les projets' },
]

export default function SetupPage() {
  const [step, setStep] = useState<Step>(1)
  const [userType, setUserType] = useState<UserType | null>(null)

  // Step 2 fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')

  // Step 3 - Partner fields
  const [specialty, setSpecialty] = useState('')
  const [monthlyVolume, setMonthlyVolume] = useState('')
  const [tools, setTools] = useState<string[]>([])

  // Step 3 - Client fields
  const [projectType, setProjectType] = useState('')
  const [budgetRange, setBudgetRange] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useStore()
  const router = useRouter()

  const toggleTool = (tool: string) => {
    setTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool])
  }

  const canGoNext = () => {
    switch (step) {
      case 1: return userType !== null
      case 2: return fullName.trim() && email.trim() && password.length >= 6
      case 3:
        if (userType === 'partner') return specialty && monthlyVolume
        return projectType && budgetRange
      default: return true
    }
  }

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step)
  }

  const handleFinish = async () => {
    setLoading(true)
    setError('')

    const extra = userType === 'partner'
      ? { user_type: 'partner' as const, specialty, monthly_volume: monthlyVolume, tools, phone }
      : { user_type: 'client_direct' as const, project_type: projectType, budget_range: budgetRange, phone }

    const success = await signup(email, password, fullName, company, extra)
    if (success) {
      setTimeout(() => router.push('/dashboard'), 800)
    } else {
      setError('Un compte existe déjà avec cet email.')
      setLoading(false)
      setStep(2)
    }
  }

  const stepLabels = ['Type', 'Infos', 'Profil', 'Go !']

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
        <Link href="/" className="flex items-center gap-3">
          <MotionLogo className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight">Fahim AE</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
          Déjà un compte ? Se connecter
        </Link>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 max-w-xl mx-auto px-6 mt-4 mb-12">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${
                  i + 1 < step ? 'bg-primary border-primary text-white' :
                  i + 1 === step ? 'bg-primary/20 border-primary text-primary' :
                  'bg-white/5 border-white/10 text-gray-500'
                }`}>
                  {i + 1 < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  i + 1 <= step ? 'text-white' : 'text-gray-600'
                }`}>{label}</span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-[2px] mx-3 mt-[-20px] rounded-full transition-all duration-500 ${
                  i + 1 < step ? 'bg-primary' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-20">

        {/* STEP 1 - Choose Type */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-4">Bienvenue chez Fahim AE</h1>
              <p className="text-gray-400 text-lg">Choisissez votre profil pour qu'on s'adapte à vos besoins.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BorderGlow
                glowColor="269 80 70"
                backgroundColor={userType === 'partner' ? '#1a1535' : '#1F2937'}
                borderRadius={28}
                glowRadius={30}
                glowIntensity={0.8}
                coneSpread={20}
                colors={['#4B5563', '#6B7280', '#38bdf8']}
              >
                <button
                  onClick={() => setUserType('partner')}
                  className={`w-full p-8 text-left cursor-pointer transition-all ${
                    userType === 'partner' ? 'ring-2 ring-primary rounded-[28px]' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all ${
                    userType === 'partner'
                      ? 'bg-primary border-primary text-white'
                      : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    <Users size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Partenaire / Monteur</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Vous êtes monteur, réalisateur ou agence. Vous voulez déléguer le Motion Design
                    et garder la marge avec vos clients.
                  </p>
                  {userType === 'partner' && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                      <Check size={16} /> Sélectionné
                    </div>
                  )}
                </button>
              </BorderGlow>

              <BorderGlow
                glowColor="269 80 70"
                backgroundColor={userType === 'client_direct' ? '#1a1535' : '#1F2937'}
                borderRadius={28}
                glowRadius={30}
                glowIntensity={0.8}
                coneSpread={20}
                colors={['#4B5563', '#6B7280', '#38bdf8']}
              >
                <button
                  onClick={() => setUserType('client_direct')}
                  className={`w-full p-8 text-left cursor-pointer transition-all ${
                    userType === 'client_direct' ? 'ring-2 ring-primary rounded-[28px]' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all ${
                    userType === 'client_direct'
                      ? 'bg-primary border-primary text-white'
                      : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Client Direct</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Vous êtes une marque, un entrepreneur ou un créateur. Vous avez besoin
                    de Motion Design pour vos projets.
                  </p>
                  {userType === 'client_direct' && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                      <Check size={16} /> Sélectionné
                    </div>
                  )}
                </button>
              </BorderGlow>
            </div>
          </div>
        )}

        {/* STEP 2 - Personal Info */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black mb-3">Vos informations</h1>
              <p className="text-gray-400">On a besoin de quelques détails pour créer votre espace.</p>
            </div>

            <div className="max-w-lg mx-auto">
              <BorderGlow
                glowColor="269 80 70"
                backgroundColor="#1F2937"
                borderRadius={28}
                glowRadius={25}
                glowIntensity={0.6}
                coneSpread={20}
                colors={['#4B5563', '#6B7280', '#38bdf8']}
              >
                <div className="p-8 space-y-5">
                  {error && (
                    <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Mot de passe *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        {userType === 'partner' ? 'Entreprise / Studio' : 'Marque / Entreprise'}
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder={userType === 'partner' ? 'Studio Montage' : 'Ma Marque'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+33 6 ..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                      />
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        )}

        {/* STEP 3 - Profile Details */}
        {step === 3 && userType === 'partner' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black mb-3">Votre activité</h1>
              <p className="text-gray-400">Pour qu'on calibre le volume et le type de projets à vous envoyer.</p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              {/* Specialty */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Votre spécialité principale</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSpecialty(s.id)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        specialty === s.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <s.icon size={24} className="mx-auto mb-2" />
                      <span className="text-xs font-bold">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Volume estimé de motion design</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOLUME_OPTIONS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setMonthlyVolume(v.id)}
                      className={`px-5 py-3.5 rounded-2xl border text-left text-sm font-medium transition-all cursor-pointer ${
                        monthlyVolume === v.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Vos outils de travail <span className="text-gray-500 font-normal text-sm">(optionnel)</span></h3>
                <div className="flex flex-wrap gap-2">
                  {['Premiere Pro', 'DaVinci Resolve', 'Final Cut', 'After Effects', 'CapCut', 'Autre'].map(tool => (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                        tools.includes(tool)
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && userType === 'client_direct' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black mb-3">Votre projet</h1>
              <p className="text-gray-400">Pour qu'on comprenne vos besoins en motion design.</p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              {/* Project Type */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Quel type de motion vous intéresse ?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PROJECT_TYPES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setProjectType(p.id)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        projectType === p.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <p.icon size={24} className="mx-auto mb-2" />
                      <span className="text-xs font-bold">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-200">Budget estimé par projet</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_OPTIONS.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBudgetRange(b.id)}
                      className={`px-5 py-3.5 rounded-2xl border text-left text-sm font-medium transition-all cursor-pointer ${
                        budgetRange === b.id
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 - Confirmation */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles size={36} className="text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3">Tout est prêt !</h1>
              <p className="text-gray-400 text-lg">Voici un récap avant de créer votre espace.</p>
            </div>

            <div className="max-w-lg mx-auto">
              <BorderGlow
                glowColor="269 80 70"
                backgroundColor="#1F2937"
                borderRadius={28}
                glowRadius={25}
                glowIntensity={0.6}
                coneSpread={20}
                colors={['#4B5563', '#6B7280', '#38bdf8']}
              >
                <div className="p-8 space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{fullName}</p>
                      <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type de compte</span>
                      <span className="font-bold text-white">
                        {userType === 'partner' ? 'Partenaire / Monteur' : 'Client Direct'}
                      </span>
                    </div>
                    {company && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entreprise</span>
                        <span className="font-bold text-white">{company}</span>
                      </div>
                    )}
                    {userType === 'partner' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Spécialité</span>
                          <span className="font-bold text-white">
                            {SPECIALTIES.find(s => s.id === specialty)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume</span>
                          <span className="font-bold text-white">
                            {VOLUME_OPTIONS.find(v => v.id === monthlyVolume)?.label}
                          </span>
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
                      </>
                    )}
                    {userType === 'client_direct' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type de projet</span>
                          <span className="font-bold text-white">
                            {PROJECT_TYPES.find(p => p.id === projectType)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Budget</span>
                          <span className="font-bold text-white">
                            {BUDGET_OPTIONS.find(b => b.id === budgetRange)?.label}
                          </span>
                        </div>
                      </>
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
                          Créer mon espace
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
        {step < 4 && (
          <div className="flex items-center justify-between mt-12 max-w-2xl mx-auto">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
                Retour
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
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

        {step === 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBack}
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
