'use client'

import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { formatDate } from '@/lib/utils'
import { Users, Mail, Building2 } from 'lucide-react'

export default function ClientsPage() {
  const { currentUser, profiles, orders } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== 'admin') return null

  const clients = profiles.filter(p => p.role === 'client')

  const clientStats: Record<string, { orders: number; revenue: number; seconds: number }> = {}
  for (const order of orders) {
    if (!clientStats[order.client_id]) {
      clientStats[order.client_id] = { orders: 0, revenue: 0, seconds: 0 }
    }
    clientStats[order.client_id].orders++
    clientStats[order.client_id].revenue += order.total_price
    clientStats[order.client_id].seconds += order.seconds_ordered
  }

  return (
    <div className="flex-1 min-h-screen p-4 md:px-8 md:py-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] font-sans transition-colors duration-300">
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] dark:text-white">Partenaires</h1>
        <p className="text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-medium">{clients.length} partenaire{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}</p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white dark:bg-[#181A20] rounded-[32px] border border-gray-100 dark:border-[#23262F] p-16 text-center max-w-7xl mx-auto shadow-sm dark:shadow-none">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#23262F] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-[#23262F]">
             <Users className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-[#9CA3AF] dark:text-gray-500 font-bold">Aucun partenaire inscrit</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-10">
          {clients.map((client) => {
            const stats = clientStats[client.id] || { orders: 0, revenue: 0, seconds: 0 }
            return (
              <div key={client.id} className="bg-white dark:bg-[#181A20] rounded-[24px] border border-gray-100 dark:border-[#23262F] shadow-sm dark:shadow-none p-6 hover:shadow-md dark:hover:shadow-none hover:border-primary/20 transition-all flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-[16px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary font-bold text-xl shrink-0 border border-gray-100/50 dark:border-[#23262F] shadow-inner dark:shadow-none">
                    {(client.full_name || client.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#1F2937] dark:text-white text-lg truncate">
                      {client.full_name || 'Sans nom'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#9CA3AF] dark:text-gray-500 font-medium mt-1">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.company && (
                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] dark:text-gray-500 font-medium mt-1.5">
                        <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <span className="truncate text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#23262F] px-2 py-0.5 rounded-md border border-gray-100 dark:border-[#23262F]">{client.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                   <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-[#23262F] bg-[#F3F4F6] dark:bg-[#23262F] -mx-6 -mb-6 p-6 rounded-b-[24px]">
                     <div className="text-center">
                       <p className="text-xl font-bold text-[#1F2937] dark:text-white">{stats.orders}</p>
                       <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-gray-500 tracking-widest uppercase mt-1">Commandes</p>
                     </div>
                     <div className="text-center">
                       <p className="text-xl font-bold text-[#1F2937] dark:text-white">{stats.seconds}s</p>
                       <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-gray-500 tracking-widest uppercase mt-1">Secondes</p>
                     </div>
                     <div className="text-center">
                       <p className="text-xl font-bold text-primary">{stats.revenue}€</p>
                       <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-gray-500 tracking-widest uppercase mt-1">Revenu</p>
                     </div>
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
