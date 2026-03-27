'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import { LogIn, Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, profiles } = useStore()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Email ou mot de passe incorrect. Essayez un des comptes de démo ci-dessous.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion. Veuillez réessayer.')
    } finally {
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
        <Link href="/setup" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
          Pas encore de compte ? <span className="text-primary font-bold">S'inscrire</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-10 pb-20">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Bon retour</h1>
            <p className="text-gray-400">Connectez-vous pour accéder à votre espace.</p>
          </div>

          {/* Login Form */}
          <BorderGlow
            glowColor="269 80 70"
            backgroundColor="#1F2937"
            borderRadius={28}
            glowRadius={30}
            glowIntensity={0.7}
            coneSpread={20}
            colors={['#4B5563', '#6B7280', '#38bdf8']}
          >
            <form onSubmit={handleLogin} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="••••••••"
                />
                <div className="mt-2 text-right">
                  <Link href="/reset-password" className="text-sm text-gray-500 hover:text-primary transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-gray-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_30px_rgba(75,85,99,0.3)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Se connecter
              </button>
            </form>
          </BorderGlow>

          {/* Demo Accounts */}
          <div className="mt-6">
            <BorderGlow
              glowColor="269 80 70"
              backgroundColor="#1F2937"
              borderRadius={24}
              glowRadius={20}
              glowIntensity={0.4}
              coneSpread={25}
              colors={['#4B5563', '#6B7280', '#38bdf8']}
            >
              <div className="p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Comptes de démo</h3>
                <div className="space-y-1.5">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setEmail(p.email); setPassword('demo') }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                          {p.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-gray-500 transition-colors">{p.full_name}</p>
                          <p className="text-xs text-gray-500">{p.email}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        p.role === 'admin'
                          ? 'bg-primary/20 text-gray-500 border border-primary/30'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}>
                        {p.role === 'admin' ? 'Admin' : 'Client'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </div>
    </div>
  )
}
