'use client'

import { useStore } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import OrderTimeline from '@/components/OrderTimeline'
import OrderActions from '@/components/OrderActions'
import Link from 'next/link'
import { ClipboardList, PlusCircle, Film, Link2, ExternalLink } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default function OrdersPage() {
  const { currentUser, orders, profiles, orderAttachments } = useStore()
  if (!currentUser) return null

  const isAdmin = currentUser.role === 'admin'
  const filteredOrders = isAdmin ? orders : orders.filter(o => o.client_id === currentUser.id)

  function getProfile(clientId: string): Profile | undefined {
    return profiles.find(p => p.id === clientId)
  }

  return (
    <div className="flex-1 min-h-screen p-4 md:px-8 md:py-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] font-sans transition-colors duration-300">
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] dark:text-white">
            {isAdmin ? 'Toutes les commandes' : 'Mes commandes'}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-medium">{filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}</p>
        </div>
        {!isAdmin && (
          <Link
            href="/dashboard/new-order"
            className="flex items-center gap-2 bg-[#1F2937] hover:bg-black text-white px-5 py-2.5 rounded-full font-bold transition-colors text-sm shadow-sm dark:shadow-none dark:bg-white dark:text-[#1F2937] dark:hover:bg-gray-200"
          >
            <PlusCircle className="w-4 h-4" />
            Nouvelle commande
          </Link>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#181A20] rounded-[32px] border border-gray-100 dark:border-[#23262F] p-16 text-center shadow-sm dark:shadow-none max-w-5xl mx-auto">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#23262F] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-[#23262F]">
             <ClipboardList className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-[#9CA3AF] dark:text-gray-500 font-bold">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-5xl mx-auto pb-10">
          {filteredOrders.map((order) => {
            const orderProfile = getProfile(order.client_id)
            return (
              <div key={order.id} className="bg-white dark:bg-[#181A20] rounded-[24px] border border-gray-100 dark:border-[#23262F] shadow-sm dark:shadow-none p-6 md:p-8 hover:border-primary/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-[16px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary shrink-0 border border-gray-100/50 dark:border-[#23262F]">
                        <Film className="w-6 h-6" />
                     </div>
                     <div>
                       <div className="flex flex-wrap items-center gap-3 mb-1">
                         <h3 className="font-bold text-[#1F2937] dark:text-white text-xl">{order.project_name}</h3>
                         <StatusBadge status={order.status} />
                       </div>
                       <p className="text-sm text-[#9CA3AF] dark:text-gray-500 font-medium">
                         Partenaire : <span className="text-gray-700 dark:text-gray-300">{order.client_name}</span>
                         {isAdmin && orderProfile && (
                           <span className="text-gray-400 dark:text-gray-500">
                             {' '}— commandé par {orderProfile.full_name || orderProfile.email}
                             {orderProfile.company && ` (${orderProfile.company})`}
                           </span>
                         )}
                       </p>
                       {order.description && (
                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 font-medium bg-gray-50 dark:bg-[#23262F] p-3 rounded-[12px] border border-gray-100/50 dark:border-[#23262F] leading-relaxed">{order.description}</p>
                       )}
                     </div>
                  </div>
                  <div className="md:text-right shrink-0 bg-[#F3F4F6] dark:bg-[#23262F] p-4 rounded-[16px] border border-[#F3F4F6] dark:border-[#23262F]">
                    <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{formatCurrency(order.total_price)}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-gray-500 font-bold mt-1 tracking-widest uppercase">{order.seconds_ordered}s x {formatCurrency(order.price_per_second)}/s</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-bold text-[#9CA3AF] dark:text-gray-500 mb-6 tracking-wide auto-cols-auto">
                  <span className="bg-[#F3F4F6] dark:bg-[#23262F] px-3 py-1.5 rounded-lg border border-[#F3F4F6] dark:border-[#23262F]">{order.seconds_ordered} secondes</span>
                  <span className="bg-[#F3F4F6] dark:bg-[#23262F] px-3 py-1.5 rounded-lg border border-[#F3F4F6] dark:border-[#23262F]">{order.production_days} jour{order.production_days > 1 ? 's' : ''} prod.</span>
                  {order.deadline && (
                    <span className="bg-amber-50/50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-100/50">Deadline : {formatDate(order.deadline)}</span>
                  )}
                  <span className="text-gray-400 dark:text-gray-500 ml-auto md:inline-block hidden">Créé le {formatDate(order.created_at)}</span>
                </div>

                <div className="bg-[#F3F4F6] dark:bg-[#23262F] rounded-[16px] p-5 border border-[#F3F4F6] dark:border-[#23262F]">
                  <OrderTimeline
                    productionDays={order.production_days}
                    scheduledStart={order.scheduled_start}
                    scheduledEnd={order.scheduled_end}
                  />
                </div>

                {order.admin_notes && (
                  <div className="mt-4 bg-gray-50/40 dark:bg-[#23262F]/40 rounded-[16px] p-4 border border-gray-100/50 dark:border-[#23262F]">
                    <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-1.5">Note admin</p>
                    <p className="text-sm text-[#1F2937] dark:text-white font-medium leading-relaxed">{order.admin_notes}</p>
                  </div>
                )}

                {/* Order Attachments */}
                {(() => {
                  const attachments = orderAttachments.filter(a => a.order_id === order.id)
                  const imageAttachments = attachments.filter(a => a.file_type === 'image')
                  const linkAttachments = attachments.filter(a => a.file_type === 'link')
                  if (attachments.length === 0) return null
                  return (
                    <div className="mt-4 bg-gray-50/40 dark:bg-[#23262F]/40 rounded-[16px] p-4 border border-gray-100/50 dark:border-[#23262F]">
                      <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-3">Pièces jointes</p>
                      {imageAttachments.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
                          {imageAttachments.map(att => (
                            <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-[#23262F] hover:border-gray-400 dark:hover:border-gray-500 transition">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={att.file_url} alt={att.file_name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition drop-shadow" />
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                      {linkAttachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {linkAttachments.map(att => (
                            <a
                              key={att.id}
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#181A20] rounded-lg border border-gray-200 dark:border-[#23262F] hover:border-gray-400 dark:hover:border-gray-500 transition text-xs font-medium text-gray-600 dark:text-gray-300"
                            >
                              <Link2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[200px]">{att.file_name}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 text-gray-400" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {isAdmin && (order.status === 'pending' || order.status === 'in_progress') && (
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#23262F]">
                    <OrderActions order={order} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
