'use client'

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { User, DollarSign, Zap, Bell, Save, Check, Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#1F2937] dark:bg-white' : 'bg-gray-200 dark:bg-[#2C2F38]'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-[#1F2937] rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { currentUser, settings, updateSettings, updateProfile } = useStore()
  const router = useRouter()

  const [pricePerSecond, setPricePerSecond] = useState(settings.price_per_second)
  const [secondsPerDay, setSecondsPerDay] = useState(settings.seconds_per_day)
  const [saved, setSaved] = useState(false)

  const [fullName, setFullName] = useState(currentUser?.full_name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [company, setCompany] = useState(currentUser?.company || '')

  // Partner extra fields
  const [specialty, setSpecialty] = useState(currentUser?.specialty || '')
  const [monthlyVolume, setMonthlyVolume] = useState(currentUser?.monthly_volume || '')
  const [partnerPhone, setPartnerPhone] = useState(currentUser?.phone || '')

  // Client extra fields
  const [projectType, setProjectType] = useState(currentUser?.project_type || '')
  const [budgetRange, setBudgetRange] = useState(currentUser?.budget_range || '')
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '')

  const [notifNewOrder, setNotifNewOrder] = useState(true)
  const [notifStatusChange, setNotifStatusChange] = useState(true)
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  if (!currentUser) return null

  const isAdmin = currentUser.role === 'admin'
  const isPartner = currentUser.role === 'partner'
  const isClient = currentUser.role === 'client'

  const exampleSeconds = 60
  const examplePrice = exampleSeconds * pricePerSecond
  const exampleDays = Math.ceil(exampleSeconds / secondsPerDay)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const profileUpdates: Record<string, string> = { full_name: fullName, email, company }

    if (isPartner) {
      profileUpdates.specialty = specialty
      profileUpdates.monthly_volume = monthlyVolume
      profileUpdates.phone = partnerPhone
    }
    if (isClient) {
      profileUpdates.project_type = projectType
      profileUpdates.budget_range = budgetRange
      profileUpdates.phone = clientPhone
    }

    if (isAdmin) {
      updateSettings({ price_per_second: pricePerSecond, seconds_per_day: secondsPerDay })
    }
    updateProfile(currentUser!.id, profileUpdates)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 2 Mo.')
      return
    }

    const ext = file.name.split('.').pop()
    const filePath = `${currentUser!.id}/${Date.now()}.${ext}`

    setAvatarUploading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.storage.from('avatars').upload(filePath, file)
      if (error) throw error

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const avatarUrl = urlData.publicUrl

      await updateProfile(currentUser!.id, { avatar_url: avatarUrl })
    } catch (err) {
      console.error('Erreur lors du téléchargement de l\'avatar:', err)
    } finally {
      setAvatarUploading(false)
      // Reset input so re-selecting the same file triggers change
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 dark:border-[#2C2F38] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white"

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] dark:text-white">Paramètres</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Configurez votre profil et vos préférences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-3 rounded-[16px] font-bold text-sm transition-colors cursor-pointer ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] hover:bg-[#111827] dark:hover:bg-gray-200'
          }`}
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Profile */}
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-6 shadow-sm dark:shadow-none lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary dark:text-gray-300">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-[#1F2937] dark:text-white">Profil</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Informations de votre compte</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-[20px] bg-gray-100 dark:bg-[#23262F] flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300 uppercase overflow-hidden border-2 border-gray-200 dark:border-[#2C2F38]">
                {avatarUploading ? (
                  <Loader2 size={28} className="animate-spin text-gray-400" />
                ) : currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser.email?.charAt(0) || 'U'
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {avatarUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                {avatarUploading ? 'Envoi...' : 'Modifier'}
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entreprise</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={inputClass} />
              </div>

              {/* Partner extra fields */}
              {isPartner && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Spécialité</label>
                    <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Volume mensuel</label>
                    <input type="text" value={monthlyVolume} onChange={e => setMonthlyVolume(e.target.value)} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                    <input type="tel" value={partnerPhone} onChange={e => setPartnerPhone(e.target.value)} className={inputClass} />
                  </div>
                </>
              )}

              {/* Client extra fields */}
              {isClient && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de projet</label>
                    <input type="text" value={projectType} onChange={e => setProjectType(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget estimé</label>
                    <input type="text" value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                    <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className={inputClass} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Pricing - Admin only */}
        {isAdmin && (
          <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary dark:text-gray-300">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F2937] dark:text-white">Tarification</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">Prix par seconde de motion</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix par seconde (EUR)</label>
                <div className="relative">
                  <input type="number" min="0.01" step="0.01" value={pricePerSecond} onChange={e => setPricePerSecond(Number(e.target.value))} className={`${inputClass} pr-12`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 dark:text-gray-500">EUR/s</span>
                </div>
              </div>
              <div className="bg-[#FAFBFC] dark:bg-[#12131A] rounded-[16px] p-4 mt-4">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3">Simulation : {exampleSeconds}s de motion</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#1F2937] dark:text-white">{formatCurrency(examplePrice)}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">({exampleSeconds}s x {formatCurrency(pricePerSecond)}/s)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Production - Admin only */}
        {isAdmin && (
          <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary dark:text-gray-300">
                <Zap size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F2937] dark:text-white">Production</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">Vitesse de production quotidienne</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondes par jour</label>
                <div className="relative">
                  <input type="number" min="1" value={secondsPerDay} onChange={e => setSecondsPerDay(Number(e.target.value))} className={`${inputClass} pr-12`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 dark:text-gray-500">s/jour</span>
                </div>
              </div>
              <div className="bg-[#FAFBFC] dark:bg-[#12131A] rounded-[16px] p-4 mt-4">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3">Temps pour {exampleSeconds}s de motion</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#1F2937] dark:text-white">{exampleDays} jour{exampleDays > 1 ? 's' : ''}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">({exampleSeconds}s / {secondsPerDay}s par jour)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-6 shadow-sm dark:shadow-none lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary dark:text-gray-300">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-bold text-[#1F2937] dark:text-white">Notifications</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Choisissez quelles notifications recevoir</p>
            </div>
          </div>
          <div className="space-y-1">
            {[
              { label: 'Nouvelles commandes', desc: 'Recevoir une alerte quand un client passe commande', checked: notifNewOrder, onChange: setNotifNewOrder },
              { label: 'Changements de statut', desc: 'Notifier quand une commande change de statut', checked: notifStatusChange, onChange: setNotifStatusChange },
              { label: 'Messages', desc: 'Recevoir les notifications de nouveaux messages', checked: notifMessages, onChange: setNotifMessages },
              { label: 'Notifications par email', desc: 'Recevoir aussi les notifications par email', checked: notifEmail, onChange: setNotifEmail },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-[#23262F] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1F2937] dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={item.checked} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}
