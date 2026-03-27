'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Calendar,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ArrowLeftRight,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  profile: Profile
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, notifications, profiles, switchUser } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showSwitcher, setShowSwitcher] = useState(false)
  const isAdmin = profile.role === 'admin'

  const unreadCount = notifications.filter(n => n.user_id === profile.id && !n.read).length

  const clientLinks = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/new-order', label: 'Nouvelle commande', icon: PlusCircle },
    { href: '/dashboard/orders', label: 'Mes commandes', icon: ClipboardList },
  ]

  const adminLinks = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'Commandes', icon: ClipboardList },
    { href: '/dashboard/clients', label: 'Clients', icon: Users },
    { href: '/dashboard/calendar', label: 'Calendrier', icon: Calendar },
    { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
  ]

  const links = isAdmin ? adminLinks : clientLinks

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const nav = (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
            MP
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm truncate">Fahim AE</h2>
            <p className="text-xs text-gray-500 truncate">{profile.full_name || profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={cn(
            'inline-block text-xs font-medium px-2.5 py-1 rounded-full',
            isAdmin ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'
          )}>
            {isAdmin ? 'Admin' : 'Client'}
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
              <Bell className="w-3 h-3" />
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-gray-50 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        {/* User switcher for demo */}
        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors w-full cursor-pointer"
        >
          <ArrowLeftRight className="w-5 h-5" />
          Changer de compte (démo)
        </button>

        {showSwitcher && (
          <div className="ml-2 space-y-1 pb-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  switchUser(p.id)
                  setShowSwitcher(false)
                  setMobileOpen(false)
                  router.push('/dashboard')
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer',
                  p.id === profile.id
                    ? 'bg-gray-50 text-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <p className="font-medium">{p.full_name}</p>
                <p className="text-gray-400">{p.role === 'admin' ? 'Admin' : 'Client'}</p>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 h-screen sticky top-0">
        {nav}
      </aside>
    </>
  )
}
