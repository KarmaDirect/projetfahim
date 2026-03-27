'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { formatCurrency, calculateProductionDays, calculatePrice } from '@/lib/utils'
import OrderTimeline from '@/components/OrderTimeline'
import { Send, Loader2, Calculator, ImagePlus, Link2, X } from 'lucide-react'

interface PendingAttachment {
  id: string
  type: 'image' | 'link'
  file?: File
  url?: string
  fileName: string
  preview?: string
}

export default function NewOrderPage() {
  const [clientName, setClientName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [seconds, setSeconds] = useState<number>(0)
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([])
  const [linkInput, setLinkInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { currentUser, settings, addOrder, addOrderAttachment } = useStore()
  const router = useRouter()

  if (!currentUser) return null

  const price = calculatePrice(seconds, settings.price_per_second)
  const productionDays = calculateProductionDays(seconds, settings.seconds_per_day)

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const newAttachments: PendingAttachment[] = Array.from(files).map(file => ({
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'image' as const,
      file,
      fileName: file.name,
      preview: URL.createObjectURL(file),
    }))
    setPendingAttachments(prev => [...prev, ...newAttachments])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleAddLink() {
    const url = linkInput.trim()
    if (!url) return
    setPendingAttachments(prev => [...prev, {
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'link',
      url,
      fileName: url,
    }])
    setLinkInput('')
  }

  function handleRemovePending(id: string) {
    setPendingAttachments(prev => {
      const item = prev.find(a => a.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter(a => a.id !== id)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (seconds <= 0) return

    setLoading(true)

    const order = await addOrder({
      client_id: currentUser!.id,
      client_name: clientName,
      project_name: projectName,
      description,
      seconds_ordered: seconds,
      price_per_second: settings.price_per_second,
      production_days: productionDays,
      deadline: deadline || null,
    })

    // Upload all pending attachments
    if (order) {
      for (const attachment of pendingAttachments) {
        if (attachment.type === 'image' && attachment.file) {
          await addOrderAttachment(order.id, attachment.file)
        } else if (attachment.type === 'link' && attachment.url) {
          await addOrderAttachment(order.id, undefined, attachment.url, attachment.fileName)
        }
      }
    }

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

            {/* Attachments section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Références & Images</label>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#23262F]/80 transition text-sm font-medium cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4" />
                  Ajouter des images
                </button>

                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink() } }}
                    className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition text-sm"
                    placeholder="https://exemple.com/reference"
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 dark:border-[#23262F] dark:bg-[#23262F] dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#23262F]/80 transition text-sm font-medium cursor-pointer"
                  >
                    <Link2 className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              {pendingAttachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pendingAttachments.map((att) => (
                    <div key={att.id} className="relative group bg-gray-50 dark:bg-[#23262F] rounded-xl border border-gray-200 dark:border-[#23262F] overflow-hidden">
                      {att.type === 'image' && att.preview ? (
                        <div className="aspect-square">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={att.preview} alt={att.fileName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-square flex flex-col items-center justify-center p-3 text-center">
                          <Link2 className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-all line-clamp-3">{att.fileName}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePending(att.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                      <div className="px-2 py-1.5 border-t border-gray-200 dark:border-[#2A2D35]">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{att.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
