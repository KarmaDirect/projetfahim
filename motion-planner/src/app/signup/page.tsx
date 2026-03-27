'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import { UserPlus, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useStore()
  const router = useRouter()

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (signup(email, password, fullName, company)) {
      router.push('/dashboard')
    } else {
      setError('Un compte existe déjà avec cet email.')
      setLoading(false)
    }
  }

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
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
          Déjà un compte ? <span className="text-primary font-bold">Se connecter</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-10 pb-20">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Créer un compte</h1>
            <p className="text-gray-400">Rejoignez Fahim AE en quelques secondes.</p>
          </div>

          {/* Signup Form */}
          <BorderGlow
            glowColor="269 80 70"
            backgroundColor="#1F2937"
            borderRadius={28}
            glowRadius={30}
            glowIntensity={0.7}
            coneSpread={20}
            colors={['#4B5563', '#6B7280', '#38bdf8']}
          >
            <form onSubmit={handleSignup} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-300 mb-2">Nom complet</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-bold text-gray-300 mb-2">Entreprise / Studio</label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="Studio Vidéo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="Minimum 6 caractères"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-gray-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_30px_rgba(75,85,99,0.3)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Créer mon compte
              </button>
            </form>
          </BorderGlow>

          {/* Redirect to setup */}
          <div className="mt-6 text-center">
            <Link href="/setup" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-500 transition-colors font-medium group">
              Vous voulez un onboarding guidé ?
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
