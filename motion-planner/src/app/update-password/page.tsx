'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import { Lock, Loader2, ArrowLeft } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/login')
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
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
      </nav>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-10 pb-20">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Nouveau mot de passe</h1>
            <p className="text-gray-400">Choisissez un nouveau mot de passe pour votre compte.</p>
          </div>

          {/* Form */}
          <BorderGlow
            glowColor="269 80 70"
            backgroundColor="#1F2937"
            borderRadius={28}
            glowRadius={30}
            glowIntensity={0.7}
            coneSpread={20}
            colors={['#4B5563', '#6B7280', '#38bdf8']}
          >
            <form onSubmit={handleUpdate} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">Nouveau mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-2">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-gray-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_30px_rgba(75,85,99,0.3)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                Mettre à jour le mot de passe
              </button>
            </form>
          </BorderGlow>
        </div>
      </div>
    </div>
  )
}
