'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Star, Plus, Trash2, X, MessageSquare } from 'lucide-react'

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => !readonly && onChange?.(i)}
          className={`${readonly ? '' : 'cursor-pointer hover:scale-110'} transition-transform`}
          disabled={readonly}
        >
          <Star size={readonly ? 14 : 20} className={i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const { currentUser, reviews, addReview, deleteReview, orders, profiles } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ order_id: '', content: '', rating: 5 })

  if (!currentUser) return null

  const isAdmin = currentUser.role === 'admin'

  const visibleReviews = isAdmin
    ? reviews
    : reviews.filter(r => r.client_id === currentUser.id)

  const reviewableOrders = isAdmin
    ? []
    : orders
        .filter(o => o.client_id === currentUser.id && o.status === 'completed')
        .filter(o => !reviews.some(r => r.order_id === o.id))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const order = orders.find(o => o.id === formData.order_id)
    addReview({
      client_id: currentUser!.id,
      client_name: currentUser!.full_name || currentUser!.email,
      order_id: formData.order_id || null,
      project_name: order?.project_name || 'Avis général',
      content: formData.content,
      rating: formData.rating,
    })
    setFormData({ order_id: '', content: '', rating: 5 })
    setShowForm(false)
  }

  const avgRating = visibleReviews.length > 0
    ? (visibleReviews.reduce((s, r) => s + r.rating, 0) / visibleReviews.length).toFixed(1)
    : '—'

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] dark:text-white">
            {isAdmin ? 'Avis clients' : 'Mes avis'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {isAdmin ? 'Gérez les témoignages de vos partenaires' : 'Laissez un avis sur vos commandes terminées'}
          </p>
        </div>
        {!isAdmin && reviewableOrders.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-[16px] bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] font-bold text-sm hover:bg-[#111827] dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Laisser un avis
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-5 shadow-sm dark:shadow-none">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Total avis</p>
          <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{visibleReviews.length}</p>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-5 shadow-sm dark:shadow-none">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Note moyenne</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{avgRating}</p>
            <Star size={20} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-5 shadow-sm dark:shadow-none">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">5 étoiles</p>
          <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{visibleReviews.filter(r => r.rating === 5).length}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181A20] rounded-[24px] p-8 w-full max-w-lg shadow-2xl mx-4 border border-transparent dark:border-[#23262F]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Nouvel avis</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#23262F] rounded-full cursor-pointer">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commande</label>
                <select
                  value={formData.order_id}
                  onChange={e => setFormData(p => ({ ...p, order_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#2C2F38] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white"
                  required
                >
                  <option value="">Sélectionnez une commande</option>
                  {reviewableOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.project_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note</label>
                <StarRating value={formData.rating} onChange={v => setFormData(p => ({ ...p, rating: v }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre avis</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#2C2F38] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 resize-none bg-white dark:bg-[#23262F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="Décrivez votre expérience..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-[16px] bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] font-bold text-sm hover:bg-[#111827] dark:hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Publier l&apos;avis
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {visibleReviews.length === 0 ? (
        <div className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-12 text-center shadow-sm dark:shadow-none">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-400 dark:text-gray-500 font-medium">Aucun avis pour le moment</p>
          {!isAdmin && <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Complétez une commande pour laisser un avis</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleReviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] p-6 shadow-sm dark:shadow-none hover:border-gray-200 dark:hover:border-[#2C2F38] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-gray-100 dark:bg-[#23262F] flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-sm">
                    {review.client_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[#1F2937] dark:text-white text-sm">{review.client_name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{review.project_name}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <StarRating value={review.rating} readonly />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{review.content}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-3">
                {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
