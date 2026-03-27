'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { Order } from '@/lib/types'
import { Check, X, Edit3, Save } from 'lucide-react'

interface OrderActionsProps {
  order: Order
}

export default function OrderActions({ order }: OrderActionsProps) {
  const [editing, setEditing] = useState(false)
  const [productionDays, setProductionDays] = useState(order.production_days)
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '')
  const { updateOrder, addNotification, orders } = useStore()

  function scheduleOrder(days: number): { start: string; end: string } {
    // Find the latest scheduled_end among in_progress orders
    const scheduledOrders = orders.filter(o =>
      o.status === 'in_progress' && o.scheduled_end && o.id !== order.id
    )
    let startDate = new Date()

    if (scheduledOrders.length > 0) {
      const latestEnd = scheduledOrders.reduce((latest, o) => {
        const end = new Date(o.scheduled_end!)
        return end > latest ? end : latest
      }, new Date(0))

      if (latestEnd > startDate) {
        startDate = new Date(latestEnd)
        startDate.setDate(startDate.getDate() + 1)
      }
    }

    // Skip weekends
    while (startDate.getDay() === 0 || startDate.getDay() === 6) {
      startDate.setDate(startDate.getDate() + 1)
    }

    const endDate = new Date(startDate)
    let remaining = days - 1
    while (remaining > 0) {
      endDate.setDate(endDate.getDate() + 1)
      if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
        remaining--
      }
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    }
  }

  function handleAccept() {
    const schedule = scheduleOrder(productionDays)
    updateOrder(order.id, {
      status: 'in_progress',
      production_days: productionDays,
      admin_notes: adminNotes,
      scheduled_start: schedule.start,
      scheduled_end: schedule.end,
    })
    addNotification({
      user_id: order.client_id,
      title: 'Commande acceptée',
      message: `Votre commande "${order.project_name}" a été acceptée et est en cours de production.`,
      order_id: order.id,
    })
  }

  function handleReject() {
    updateOrder(order.id, { status: 'rejected', admin_notes: adminNotes })
    addNotification({
      user_id: order.client_id,
      title: 'Commande refusée',
      message: `Votre commande "${order.project_name}" a été refusée.`,
      order_id: order.id,
    })
  }

  function handleComplete() {
    updateOrder(order.id, { status: 'completed' })
    addNotification({
      user_id: order.client_id,
      title: 'Commande terminée',
      message: `Votre commande "${order.project_name}" est terminée !`,
      order_id: order.id,
    })
  }

  function handleSaveEdit() {
    updateOrder(order.id, { production_days: productionDays, admin_notes: adminNotes })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Jours de production</label>
            <input
              type="number"
              min="1"
              value={productionDays}
              onChange={(e) => setProductionDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes admin</label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              placeholder="Notes..."
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Sauvegarder
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {order.status === 'pending' && (
        <>
          <button
            onClick={handleAccept}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Accepter
          </button>
          <button
            onClick={handleReject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Refuser
          </button>
        </>
      )}
      {order.status === 'in_progress' && (
        <button
          onClick={handleComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          Marquer terminé
        </button>
      )}
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
      >
        <Edit3 className="w-3.5 h-3.5" />
        Modifier
      </button>
    </div>
  )
}
