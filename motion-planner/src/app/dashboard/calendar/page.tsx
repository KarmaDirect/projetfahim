'use client'

import { useStore } from '@/lib/store'
import CalendarView from '@/components/CalendarView'

export default function CalendarPage() {
  const { currentUser, orders, daysOff, addDayOff, removeDayOff, workSchedule, updateWorkSchedule } = useStore()

  if (!currentUser) return null

  const isAdmin = currentUser.role === 'admin'

  const scheduledOrders = isAdmin
    ? orders.filter(o => (o.status === 'in_progress' || o.status === 'completed') && o.scheduled_start)
    : orders.filter(o => o.client_id === currentUser.id && (o.status === 'in_progress' || o.status === 'completed') && o.scheduled_start)

  return (
    <div className="flex-1 h-full p-4 md:px-8 md:py-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] font-sans transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] dark:text-white">Planning de production</h1>
        <p className="text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-medium">
          {isAdmin ? 'Gérez votre calendrier, jours off et heures de travail' : 'Vue du calendrier et de la charge de travail'}
        </p>
      </div>

      <CalendarView
        orders={scheduledOrders}
        daysOff={daysOff}
        workSchedule={workSchedule}
        isAdmin={isAdmin}
        onAddDayOff={addDayOff}
        onRemoveDayOff={removeDayOff}
        onUpdateSchedule={updateWorkSchedule}
      />
    </div>
  )
}
