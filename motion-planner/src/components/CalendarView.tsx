'use client'

import { useState, useMemo } from 'react'
import { addDays, startOfWeek, endOfWeek, format, isSameDay, isWithinInterval, addWeeks, subWeeks, startOfDay, startOfMonth, endOfMonth, addMonths, subMonths, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Order, DayOff, WorkSchedule } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Trash2, Clock, CalendarOff } from 'lucide-react'

interface CalendarViewProps {
  orders: Order[]
  daysOff: DayOff[]
  workSchedule: WorkSchedule[]
  isAdmin: boolean
  onAddDayOff: (data: { date: string; label: string }) => void
  onRemoveDayOff: (id: string) => void
  onUpdateSchedule: (id: string, updates: Partial<WorkSchedule>) => void
}

const COLORS = [
  { bg: 'bg-blue-100 dark:bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-900 dark:text-blue-300', dot: 'bg-blue-400' },
  { bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-900 dark:text-emerald-300', dot: 'bg-emerald-400' },
  { bg: 'bg-amber-100 dark:bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-900 dark:text-amber-300', dot: 'bg-amber-400' },
  { bg: 'bg-rose-100 dark:bg-rose-500/20', border: 'border-rose-400', text: 'text-rose-900 dark:text-rose-300', dot: 'bg-rose-400' },
  { bg: 'bg-cyan-100 dark:bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-900 dark:text-cyan-300', dot: 'bg-cyan-400' },
  { bg: 'bg-purple-100 dark:bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-900 dark:text-purple-300', dot: 'bg-purple-400' },
]

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default function CalendarView({ orders, daysOff, workSchedule, isAdmin, onAddDayOff, onRemoveDayOff, onUpdateSchedule }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month' | 'timeline'>('week')
  const [showDayOffModal, setShowDayOffModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [dayOffForm, setDayOffForm] = useState({ date: '', label: '' })
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showReadOnlyScheduleModal, setShowReadOnlyScheduleModal] = useState(false)

  const today = startOfDay(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart.getTime()])

  const monthWeeks = useMemo(() => {
    const start = startOfWeek(monthStart, { weekStartsOn: 1 })
    const weeks: Date[][] = []
    let day = start
    while (day <= monthEnd || weeks.length < 5) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(day)
        day = addDays(day, 1)
      }
      weeks.push(week)
      if (weeks.length >= 6) break
    }
    return weeks
  }, [monthStart.getTime(), monthEnd.getTime()])

  const timelineStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const timelineWeeks = useMemo(() => {
    return Array.from({ length: 4 }, (_, weekIdx) => {
      const ws = addWeeks(timelineStart, weekIdx)
      return Array.from({ length: 7 }, (_, dayIdx) => addDays(ws, dayIdx))
    })
  }, [timelineStart.getTime()])
  const allTimelineDays = timelineWeeks.flat()

  function isDayOff(date: Date): DayOff | undefined {
    const dateStr = format(date, 'yyyy-MM-dd')
    return daysOff.find(d => d.date === dateStr)
  }

  function isNonWorkingDay(date: Date): boolean {
    const dow = getDay(date)
    const schedule = workSchedule.find(w => w.day_of_week === dow)
    return schedule ? !schedule.is_working : false
  }

  function isUnavailable(date: Date): boolean {
    return !!isDayOff(date) || isNonWorkingDay(date)
  }

  function getScheduleForDay(date: Date): WorkSchedule | undefined {
    return workSchedule.find(w => w.day_of_week === getDay(date))
  }

  function getOrdersForDay(date: Date) {
    return orders.filter(order => {
      if (!order.scheduled_start || !order.scheduled_end) return false
      const start = startOfDay(new Date(order.scheduled_start))
      const end = startOfDay(new Date(order.scheduled_end))
      return isWithinInterval(startOfDay(date), { start, end }) || isSameDay(date, start) || isSameDay(date, end)
    })
  }

  function getOrderColor(idx: number) {
    return COLORS[idx % COLORS.length]
  }

  function handleAddDayOff(e: React.FormEvent) {
    e.preventDefault()
    if (dayOffForm.date && dayOffForm.label) {
      onAddDayOff(dayOffForm)
      setDayOffForm({ date: '', label: '' })
      setShowDayOffModal(false)
    }
  }

  function handleDayClick(day: Date) {
    if (!isAdmin) return
    setSelectedDay(selectedDay && isSameDay(selectedDay, day) ? null : day)
  }

  function prev() {
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1))
    else if (view === 'month') setCurrentDate(subMonths(currentDate, 1))
    else setCurrentDate(subWeeks(currentDate, 4))
  }
  function next() {
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1))
    else if (view === 'month') setCurrentDate(addMonths(currentDate, 1))
    else setCurrentDate(addWeeks(currentDate, 4))
  }

  const headerLabel = view === 'week'
    ? `${format(weekStart, 'd MMM', { locale: fr })} — ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`
    : view === 'month'
    ? format(currentDate, 'MMMM yyyy', { locale: fr })
    : `${format(timelineStart, 'd MMM', { locale: fr })} — ${format(addWeeks(timelineStart, 4), 'd MMM yyyy', { locale: fr })}`

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2.5 rounded-[14px] hover:bg-gray-100 dark:hover:bg-[#23262F] transition cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937] dark:text-white min-w-[240px] text-center capitalize">
            {headerLabel}
          </h2>
          <button onClick={next} className="p-2.5 rounded-[14px] hover:bg-gray-100 dark:hover:bg-[#23262F] transition cursor-pointer">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="ml-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#23262F] rounded-[14px] hover:bg-gray-100 dark:hover:bg-[#2C2F38] transition cursor-pointer"
          >
            Aujourd&apos;hui
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#23262F] border border-gray-200 dark:border-[#2C2F38] rounded-[14px] hover:bg-gray-100 dark:hover:bg-[#2C2F38] transition cursor-pointer"
              >
                <Clock size={16} />
                Horaires
              </button>
              <button
                onClick={() => { setDayOffForm({ date: '', label: '' }); setShowDayOffModal(true) }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-[#1F2937] dark:bg-white dark:text-[#1F2937] rounded-[14px] hover:bg-[#111827] dark:hover:bg-gray-200 transition cursor-pointer"
              >
                <Plus size={16} />
                Jour off
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowReadOnlyScheduleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#23262F] border border-gray-200 dark:border-[#2C2F38] rounded-[14px] hover:bg-gray-100 dark:hover:bg-[#2C2F38] transition cursor-pointer"
            >
              <Clock size={16} />
              Voir les horaires
            </button>
          )}

          <div className="flex bg-gray-100 dark:bg-[#23262F] rounded-[14px] p-1">
            {(['week', 'month', 'timeline'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-bold rounded-[10px] transition cursor-pointer ${view === v ? 'bg-white dark:bg-[#181A20] text-[#1F2937] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {v === 'week' ? 'Semaine' : v === 'month' ? 'Mois' : 'Timeline'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Days off strip */}
      {daysOff.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {daysOff
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 8)
            .map(d => (
            <div key={d.id} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-full text-xs">
              <CalendarOff size={12} className="text-red-400" />
              <span className="font-bold text-red-600 dark:text-red-400">{format(new Date(d.date + 'T12:00:00'), 'd MMM', { locale: fr })}</span>
              <span className="text-red-400 dark:text-red-500">{d.label}</span>
              {isAdmin && (
                <button onClick={() => onRemoveDayOff(d.id)} className="ml-0.5 text-red-300 hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== WEEK VIEW ===== */}
      {view === 'week' && (
        <div className="bg-white dark:bg-[#181A20] rounded-[20px] border border-gray-200 dark:border-[#23262F] shadow-sm dark:shadow-none overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#23262F]">
            {weekDays.map(day => {
              const unavailable = isUnavailable(day)
              const isToday = isSameDay(day, today)
              return (
                <div
                  key={day.toISOString()}
                  className={`p-4 text-center border-r border-gray-100 dark:border-[#23262F] last:border-r-0 ${unavailable ? 'bg-gray-50 dark:bg-[#12131A]' : ''} ${isToday ? 'bg-[#1F2937]/5 dark:bg-white/5' : ''}`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wider ${unavailable ? 'text-red-300 dark:text-red-500/50' : 'text-gray-400 dark:text-gray-500'}`}>
                    {format(day, 'EEEE', { locale: fr })}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${isToday ? 'text-[#1F2937] dark:text-white' : unavailable ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>
                    {format(day, 'd')}
                  </p>
                  {unavailable && (
                    <p className="text-[10px] font-bold mt-1 text-red-400 dark:text-red-500/70">
                      {isDayOff(day)?.label || 'OFF'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {weekDays.map(day => {
              const dayOrders = getOrdersForDay(day)
              const off = isDayOff(day)
              const nonWorking = isNonWorkingDay(day)
              const unavailable = off || nonWorking
              const isToday = isSameDay(day, today)
              const isSelected = selectedDay && isSameDay(selectedDay, day)
              const schedule = getScheduleForDay(day)

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`relative p-3 border-r border-b border-gray-100 dark:border-[#23262F] last:border-r-0 min-h-[180px] transition-colors
                    ${unavailable ? 'bg-gray-50/80 dark:bg-[#12131A]' : ''}
                    ${isToday ? 'ring-2 ring-inset ring-[#4B5563]/30 dark:ring-white/20' : ''}
                    ${isSelected ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}
                    ${isAdmin ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]' : ''}
                  `}
                >
                  {/* Work hours */}
                  {!unavailable && schedule && (
                    <div className="flex items-center gap-1 mb-2">
                      <Clock size={11} className="text-gray-300 dark:text-gray-600" />
                      <span className="text-[11px] font-medium text-gray-300 dark:text-gray-600">{schedule.start_hour} - {schedule.end_hour}</span>
                    </div>
                  )}

                  {/* Hatched pattern for unavailable days */}
                  {unavailable && (
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 6px)' }} />
                  )}

                  {/* Orders */}
                  <div className="space-y-1.5">
                    {dayOrders.map((order, idx) => {
                      const color = getOrderColor(orders.indexOf(order))
                      return (
                        <div
                          key={order.id}
                          className={`px-2.5 py-2 rounded-[10px] border-l-[3px] ${color.bg} ${color.border} ${color.text}`}
                        >
                          <p className="font-bold text-xs truncate">{order.project_name}</p>
                          <p className="text-[10px] opacity-70 truncate mt-0.5">{order.client_name} &middot; {order.seconds_ordered}s</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Quick action */}
                  {isAdmin && isSelected && (
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      {off ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveDayOff(off.id) }}
                          className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-[10px] hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors cursor-pointer"
                          title="Retirer le jour off"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : !nonWorking ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDayOffForm({ date: format(day, 'yyyy-MM-dd'), label: '' }); setShowDayOffModal(true) }}
                          className="p-1.5 bg-gray-100 dark:bg-[#23262F] text-gray-500 dark:text-gray-400 rounded-[10px] hover:bg-gray-200 dark:hover:bg-[#2C2F38] transition-colors cursor-pointer"
                          title="Marquer comme jour off"
                        >
                          <CalendarOff size={14} />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== MONTH VIEW ===== */}
      {view === 'month' && (
        <div className="bg-white dark:bg-[#181A20] rounded-[20px] border border-gray-200 dark:border-[#23262F] shadow-sm dark:shadow-none overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#23262F]">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className="p-3 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          {monthWeeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map(day => {
                const dayOrders = getOrdersForDay(day)
                const off = isDayOff(day)
                const nonWorking = isNonWorkingDay(day)
                const unavailable = off || nonWorking
                const isToday = isSameDay(day, today)
                const isCurrentMonth = day.getMonth() === currentDate.getMonth()

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={`relative p-2 border-r border-b border-gray-100 dark:border-[#23262F] last:border-r-0 min-h-[100px] transition-colors
                      ${unavailable ? 'bg-gray-50/80 dark:bg-[#12131A]' : ''}
                      ${isToday ? 'ring-2 ring-inset ring-[#4B5563]/30 dark:ring-white/20' : ''}
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                      ${isAdmin ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isToday ? 'bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] w-6 h-6 rounded-full flex items-center justify-center' : unavailable ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}>
                        {format(day, 'd')}
                      </span>
                      {off && (
                        <span className="text-[8px] font-bold text-red-400 dark:text-red-500 bg-red-50 dark:bg-red-500/10 px-1 py-0.5 rounded-full truncate max-w-[60px]">
                          {off.label}
                        </span>
                      )}
                    </div>
                    {dayOrders.slice(0, 2).map((order) => {
                      const color = getOrderColor(orders.indexOf(order))
                      return (
                        <div key={order.id} className={`mb-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border-l-2 truncate ${color.bg} ${color.border} ${color.text}`}>
                          {order.project_name}
                        </div>
                      )
                    })}
                    {dayOrders.length > 2 && (
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">+{dayOrders.length - 2}</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* ===== TIMELINE VIEW ===== */}
      {view === 'timeline' && (
        <div className="bg-white dark:bg-[#181A20] rounded-[20px] border border-gray-200 dark:border-[#23262F] shadow-sm dark:shadow-none overflow-x-auto">
          <div className="flex border-b border-gray-200 dark:border-[#23262F] min-w-[1000px]">
            <div className="w-52 shrink-0 p-4 border-r border-gray-200 dark:border-[#23262F] bg-gray-50 dark:bg-[#12131A]">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Projet</span>
            </div>
            <div className="flex-1 flex">
              {allTimelineDays.map(day => {
                const unavailable = isUnavailable(day)
                const isToday = isSameDay(day, today)
                return (
                  <div
                    key={day.toISOString()}
                    className={`flex-1 p-2 text-center border-r border-gray-100 dark:border-[#23262F] last:border-r-0 min-w-[42px] ${
                      unavailable ? 'bg-red-50/50 dark:bg-red-500/5' : isToday ? 'bg-[#1F2937]/5 dark:bg-white/5' : ''
                    }`}
                  >
                    <p className={`text-[9px] font-bold uppercase ${unavailable ? 'text-red-300 dark:text-red-600' : 'text-gray-400 dark:text-gray-500'}`}>
                      {format(day, 'EEE', { locale: fr })}
                    </p>
                    <p className={`text-[11px] font-bold ${unavailable ? 'text-red-300 dark:text-red-600' : isToday ? 'text-[#1F2937] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {format(day, 'd/M')}
                    </p>
                    {isDayOff(day) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto mt-0.5" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center text-gray-400 dark:text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun projet planifié</p>
            </div>
          ) : (
            orders.map((order, orderIdx) => {
              const color = getOrderColor(orderIdx)
              return (
                <div key={order.id} className="flex border-b border-gray-100 dark:border-[#23262F] last:border-b-0 min-w-[1000px] hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <div className="w-52 shrink-0 p-4 border-r border-gray-200 dark:border-[#23262F]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                      <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">{order.project_name}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate pl-[18px]">{order.client_name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 pl-[18px]">{order.production_days}j &middot; {formatCurrency(order.total_price)}</p>
                  </div>
                  <div className="flex-1 flex relative">
                    {allTimelineDays.map(day => {
                      const isScheduled = order.scheduled_start && order.scheduled_end &&
                        (isWithinInterval(startOfDay(day), {
                          start: startOfDay(new Date(order.scheduled_start)),
                          end: startOfDay(new Date(order.scheduled_end))
                        }) || isSameDay(day, new Date(order.scheduled_start)) || isSameDay(day, new Date(order.scheduled_end)))

                      const unavailable = isUnavailable(day)
                      const isToday = isSameDay(day, today)

                      return (
                        <div
                          key={day.toISOString()}
                          className={`flex-1 border-r border-gray-100 dark:border-[#23262F] last:border-r-0 min-w-[42px] min-h-[56px] ${
                            isScheduled ? color.bg : unavailable ? 'bg-red-50/30 dark:bg-red-500/[0.03]' : ''
                          } ${isToday ? 'ring-1 ring-[#4B5563]/20 dark:ring-white/10 ring-inset' : ''}`}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20" />
          Jour off
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-gray-50 dark:bg-[#12131A] border border-gray-200 dark:border-[#23262F] relative overflow-hidden">
            <span className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)' }} />
          </span>
          Non travaillé (hachuré)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded ring-2 ring-[#4B5563]/30 dark:ring-white/20" />
          Aujourd&apos;hui
        </span>
        {orders.slice(0, 5).map((order, idx) => {
          const color = getOrderColor(idx)
          return (
            <span key={order.id} className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded ${color.dot}`} />
              <span className="text-gray-600 dark:text-gray-400">{order.project_name}</span>
            </span>
          )
        })}
      </div>

      {/* ===== DAY OFF MODAL ===== */}
      {showDayOffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181A20] rounded-[24px] p-8 w-full max-w-md shadow-2xl mx-4 border border-transparent dark:border-[#23262F]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Ajouter un jour off</h2>
              <button onClick={() => setShowDayOffModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#23262F] rounded-full cursor-pointer">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddDayOff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={dayOffForm.date}
                  onChange={e => setDayOffForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#2C2F38] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motif</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Vacances', 'Férié', 'Perso', 'Maladie', 'Formation'].map(label => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDayOffForm(p => ({ ...p, label }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        dayOffForm.label === label
                          ? 'bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] border-[#1F2937] dark:border-white'
                          : 'bg-gray-50 dark:bg-[#23262F] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#2C2F38] hover:bg-gray-100 dark:hover:bg-[#2C2F38]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={dayOffForm.label}
                  onChange={e => setDayOffForm(p => ({ ...p, label: e.target.value }))}
                  placeholder="Ou saisissez un motif..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#2C2F38] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-[16px] bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] font-bold text-sm hover:bg-[#111827] dark:hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== READ-ONLY SCHEDULE MODAL (non-admin) ===== */}
      {showReadOnlyScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181A20] rounded-[24px] p-8 w-full max-w-lg shadow-2xl mx-4 border border-transparent dark:border-[#23262F]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Horaires de travail</h2>
              <button onClick={() => setShowReadOnlyScheduleModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#23262F] rounded-full cursor-pointer">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {workSchedule
                .slice()
                .sort((a, b) => {
                  const order = [1, 2, 3, 4, 5, 6, 0]
                  return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
                })
                .map(ws => (
                <div key={ws.id} className={`flex items-center gap-4 p-3.5 rounded-[16px] transition-colors ${ws.is_working ? 'bg-white dark:bg-[#181A20]' : 'bg-gray-50 dark:bg-[#12131A]'}`}>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${ws.is_working ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <span className={`text-sm font-bold w-24 ${ws.is_working ? 'text-[#1F2937] dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {DAY_NAMES[ws.day_of_week]}
                  </span>
                  {ws.is_working ? (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{ws.start_hour} — {ws.end_hour}</span>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600 italic">Non travaillé</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-[#12131A] rounded-[16px]">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Ces horaires indiquent les plages de disponibilité pour la production. Les jours marqués en rouge dans le calendrier correspondent aux jours off.
              </p>
            </div>
            <button
              onClick={() => setShowReadOnlyScheduleModal(false)}
              className="w-full mt-4 py-3.5 rounded-[16px] bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] font-bold text-sm hover:bg-[#111827] dark:hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===== WORK SCHEDULE MODAL ===== */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181A20] rounded-[24px] p-8 w-full max-w-lg shadow-2xl mx-4 border border-transparent dark:border-[#23262F]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Horaires de travail</h2>
              <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#23262F] rounded-full cursor-pointer">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {workSchedule
                .slice()
                .sort((a, b) => {
                  const order = [1, 2, 3, 4, 5, 6, 0]
                  return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
                })
                .map(ws => (
                <div key={ws.id} className={`flex items-center gap-4 p-3.5 rounded-[16px] transition-colors ${ws.is_working ? 'bg-white dark:bg-[#181A20]' : 'bg-gray-50 dark:bg-[#12131A]'}`}>
                  <button
                    onClick={() => onUpdateSchedule(ws.id, { is_working: !ws.is_working })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${ws.is_working ? 'bg-[#1F2937] dark:bg-white' : 'bg-gray-200 dark:bg-[#2C2F38]'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-[#1F2937] rounded-full shadow transition-transform ${ws.is_working ? 'translate-x-5' : ''}`} />
                  </button>

                  <span className={`text-sm font-bold w-24 ${ws.is_working ? 'text-[#1F2937] dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {DAY_NAMES[ws.day_of_week]}
                  </span>

                  {ws.is_working ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={ws.start_hour}
                        onChange={e => onUpdateSchedule(ws.id, { start_hour: e.target.value })}
                        className="px-3 py-2 border border-gray-200 dark:border-[#2C2F38] rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white"
                      />
                      <span className="text-gray-400 text-sm">à</span>
                      <input
                        type="time"
                        value={ws.end_hour}
                        onChange={e => onUpdateSchedule(ws.id, { end_hour: e.target.value })}
                        className="px-3 py-2 border border-gray-200 dark:border-[#2C2F38] rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 bg-white dark:bg-[#23262F] dark:text-white"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600 italic">Non travaillé</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowScheduleModal(false)}
              className="w-full mt-6 py-3.5 rounded-[16px] bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] font-bold text-sm hover:bg-[#111827] dark:hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
