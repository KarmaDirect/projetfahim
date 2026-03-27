import React, { useState, useRef, useEffect } from 'react';
import { Search, Mail, Bell, Play, MoreHorizontal, CheckCircle, Clock as ClockIcon, TrendingUp, DollarSign, Film, Check, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import type { Profile } from '@/lib/types';
import Link from 'next/link';

export default function MainContent({ profile }: { profile: Profile }) {
  const { orders, profiles, notifications, markNotificationRead, markAllNotificationsRead, messages } = useStore();
  const isAdmin = profile.role === 'admin';
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userNotifs = notifications.filter(n => n.user_id === profile.id);
  const unreadNotifCount = userNotifs.filter(n => !n.read).length;
  const unreadMsgCount = messages.filter(m => m.receiver_id === profile.id && !m.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredOrders = isAdmin
    ? orders
    : orders.filter(o => o.client_id === profile.id);

  const totalRevenue = filteredOrders
    .filter(o => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total_price, 0);

  const totalSeconds = filteredOrders
    .filter(o => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.seconds_ordered, 0);

  const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;

  function getProfile(clientId: string): Profile | undefined {
    return profiles.find(p => p.id === clientId);
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:px-8 md:py-8 overflow-y-auto bg-[#FAFBFC] dark:bg-[#0F1117] transition-colors duration-300">
      {/* Header */}
      <header className="hidden md:flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 font-medium text-gray-700 dark:text-gray-200 shadow-sm dark:shadow-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link href="/dashboard/messages" className="w-10 h-10 rounded-full bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors relative shadow-sm dark:shadow-none">
            <Mail size={20} />
            {unreadMsgCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">{unreadMsgCount}</span>
            )}
          </Link>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors relative shadow-sm dark:shadow-none cursor-pointer"
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">{unreadNotifCount}</span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#181A20] rounded-[20px] border border-gray-100 dark:border-[#23262F] shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#23262F]">
                  <h3 className="font-bold text-[#1F2937] dark:text-white text-sm">Notifications</h3>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(profile.id)}
                      className="text-xs text-primary dark:text-gray-400 font-medium hover:underline cursor-pointer"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {userNotifs.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">Aucune notification</div>
                  ) : (
                    userNotifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => !n.read && markNotificationRead(n.id)}
                        className={`px-5 py-3.5 border-b border-gray-50 dark:border-[#23262F] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#23262F] transition-colors ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1F2937] dark:text-white truncate">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#23262F] flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold uppercase overflow-hidden border border-gray-200 dark:border-[#2C2F38] shadow-sm dark:shadow-none">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.email?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-[#1F2937] dark:text-white leading-tight text-sm">{profile.full_name || profile.email?.split('@')[0]}</span>
               <span className="text-xs text-gray-400 dark:text-gray-500">{isAdmin ? 'Administrateur' : 'Partenaire'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-primary dark:bg-[#181A20] rounded-[24px] md:rounded-[32px] p-8 md:p-10 text-white overflow-hidden mb-8 shadow-xl shadow-[#4B5563]/20 dark:shadow-black/40 shrink-0 dark:border dark:border-[#23262F]">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold tracking-widest mb-4 opacity-90 uppercase text-white/80">
            {isAdmin ? 'ESPACE ADMIN' : 'MOTION DESIGN'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            {isAdmin ? 'Gérez toutes vos commandes et votre planning' : 'Donnez vie à vos idées. Suivez l\'avancement de vos vidéos.'}
          </h1>
          <Link href={isAdmin ? "/dashboard/orders" : "/dashboard/new-order"} className="inline-flex bg-[#1F2937] dark:bg-white dark:text-[#1F2937] hover:bg-black dark:hover:bg-gray-200 text-white px-6 py-3 rounded-full font-bold items-center gap-3 transition-colors">
            {isAdmin ? 'Voir le planning' : 'Nouvelle commande'}
            <div className="bg-white dark:bg-[#1F2937] rounded-full p-1 text-black dark:text-white">
              <Play size={14} fill="currentColor" className="ml-0.5" />
            </div>
          </Link>
        </div>
        <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 opacity-20 transform scale-[2] pointer-events-none hidden md:block">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10 shrink-0">
        {[
          { icon: DollarSign, title: isAdmin ? "Revenu généré" : "Total dépensé", metric: formatCurrency(totalRevenue), bg: "bg-gray-50 dark:bg-[#23262F]", color: "text-primary dark:text-gray-300" },
          { icon: Film, title: "Secondes livrées", metric: `${totalSeconds}s`, bg: "bg-pink-50 dark:bg-pink-500/10", color: "text-[#E91E63]" },
          { icon: ClockIcon, title: "En attente", metric: String(pendingOrders), bg: "bg-amber-50 dark:bg-amber-500/10", color: "text-amber-500" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] flex items-center gap-4 rounded-[24px] p-4 shadow-sm dark:shadow-none">
            <div className={`w-[48px] h-[48px] rounded-[16px] flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-0.5 truncate">{stat.title}</p>
              <p className="font-bold text-[#1F2937] dark:text-white truncate">{stat.metric}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="flex-1 min-h-[300px]">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-[#1F2937] dark:text-white">Commandes récentes</h2>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-primary dark:text-gray-400 font-semibold text-sm hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="w-full text-left overflow-x-auto pb-4">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[1.5fr_1fr_2fr_auto] gap-4 mb-4 text-[11px] font-bold tracking-[0.15em] text-[#9CA3AF] dark:text-[#4B5563] uppercase pl-4 pr-12">
              <div>Projet</div>
              <div>Statut</div>
              <div>Détails</div>
              <div className="text-center w-12">Total</div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-white dark:bg-[#181A20] rounded-[24px] border border-gray-100 dark:border-[#23262F] shadow-sm dark:shadow-none">
                <Film className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.slice(0, 5).map(order => {
                  const orderProfile = getProfile(order.client_id)
                  return (
                  <div key={order.id} className="grid grid-cols-[1.5fr_1fr_2fr_auto] gap-4 items-center p-4 bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23262F] rounded-[24px] shadow-sm dark:shadow-none hover:border-primary/30 dark:hover:border-[#4B5563]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 dark:border-[#2C2F38]">
                        <Film size={20} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-[#1F2937] dark:text-white text-sm truncate">{order.project_name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {isAdmin ? (orderProfile?.full_name || orderProfile?.email || order.client_name) : order.client_name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 font-bold text-sm block">{order.seconds_ordered}s de motion</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Jours: {order.production_days}</span>
                    </div>
                    <div className="flex justify-end w-20">
                      <span className="font-bold text-[#1F2937] dark:text-white">{formatCurrency(order.total_price)}</span>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
