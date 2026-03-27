'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { formatCurrency, calculateProductionDays, calculatePrice } from '@/lib/utils'
import OrderTimeline from '@/components/OrderTimeline'
import { Send, Loader2, Calculator } from 'lucide-react'

export default function NewOrderPage() {
  const [clientName, setClientName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [seconds, setSeconds] = useState<number>(0)
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { currentUser, settings, addOrder } = useStore()
  const router = useRouter()

  if (!currentUser) return null

  const price = calculatePrice(seconds, settings.price_per_second)
  const productionDays = calculateProductionDays(seconds, settings.seconds_per_day)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (seconds <= 0) return

    setLoading(true)

    addOrder({
      client_id: currentUser!.id,
      client_name: clientName,
      project_name: projectName,
      description,
      seconds_ordered: seconds,
      price_per_second: settings.price_per_second,
      production_days: productionDays,
      deadline: deadline || null,
    })

    setSuccess(true)
    setTimeout(() => router.push('/dashboard/orders'), 1500)
  }

  return (
    <div className="max-w-2xl transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle commande</h1>
        <p className="text-gray-500 dark:text-gray-500 mt-1">Créez une demande de motion design</p>
      </div>

      {success ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-emerald-800">Commande envoyée !</h3>
          <p className="text-emerald-600 text-sm mt-1">Redirection en cours...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-[#181A20] rounded-xl border border-gray-200 dark:border-[#23262F] shadow-sm dark:shadow-none p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Détails du projet</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du client (votre client)</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                placeholder="Ex: Entreprise XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du projet</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                placeholder="Ex: Intro vidéo YouTube"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition resize-none"
                placeholder="Décrivez votre besoin en motion design..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondes de motion design</label>
                <input
                  type="number"
                  min="1"
                  value={seconds || ''}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                  placeholder="Ex: 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline (optionnel)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Live calculation preview */}
          {seconds > 0 && (
            <div className="bg-gray-50 dark:bg-[#23262F] rounded-xl border border-gray-200 dark:border-[#23262F] p-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calculator className="w-5 h-5" />
                <h3 className="font-semibold">Estimation automatique</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Prix total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(price)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{seconds}s x {formatCurrency(settings.price_per_second)}/s</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Temps de production</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{productionDays} jour{productionDays > 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{settings.seconds_per_day}s/jour de capacité</p>
                </div>
              </div>

              <OrderTimeline productionDays={productionDays} />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || seconds <= 0}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition cursor-pointer dark:bg-white dark:text-[#1F2937] dark:hover:bg-gray-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Soumettre la commande
          </button>
        </form>
      )}
    </div>
  )
}
