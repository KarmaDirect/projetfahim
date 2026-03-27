import React from 'react';
import { Film, LayoutDashboard, Clock, BookOpen, Users, Settings, LogOut, Briefcase, MessageSquare, Star, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { Profile } from '@/lib/types';

export const MotionLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-linear-to-br from-[#6B7280] to-[#1F2937] rounded-[12px] flex items-center justify-center text-white shadow-lg shadow-[#4B5563]/30 relative overflow-hidden group`}>
    <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent"></div>
    <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 relative z-10 transform transition-transform duration-500 group-hover:scale-110">
      <path d="M4 18V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13L12 10L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 10V21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
    </svg>
  </div>
);

export default function Sidebar({ profile, closeMenu }: { profile: Profile, closeMenu?: () => void }) {
  const pathname = usePathname();
  const isAdmin = profile.role === 'admin';
  const { logout, darkMode, toggleDarkMode } = useStore();

  const handleLogout = async () => {
    logout();
  };

  const linkClass = (path: string, exact = false) => {
    const active = exact ? pathname === path : pathname?.startsWith(path);
    return `flex items-center gap-4 px-4 py-3 rounded-[16px] ${
      active
        ? 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#1F2937] dark:text-white font-bold'
        : 'text-[#9CA3AF] dark:text-[#6B7280] font-medium hover:text-[#1F2937] dark:hover:text-white transition-colors'
    }`;
  };

  return (
    <aside className="w-full md:w-[260px] flex flex-col h-full bg-white dark:bg-[#181A20] border-r border-[#F3F4F6] dark:border-[#23262F] shrink-0 z-20 pb-4 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 md:py-8">
        <MotionLogo className="w-10 h-10" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#1F2937] to-[#4B5563] dark:from-white dark:to-gray-400 tracking-tight">Fahim AE</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="px-6 mt-2 mb-8">
          <h3 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#4B5563] tracking-[0.15em] mb-4">APERÇU</h3>
          <nav className="flex flex-col gap-1">
            <Link href="/dashboard" onClick={closeMenu} className={linkClass('/dashboard', true)}>
              <LayoutDashboard size={20} className={pathname === '/dashboard' ? 'text-primary' : ''} />
              <span>Tableau de bord</span>
            </Link>
            <Link href="/dashboard/orders" onClick={closeMenu} className={linkClass('/dashboard/orders')}>
              <Film size={20} className={pathname?.startsWith('/dashboard/orders') ? 'text-primary' : ''} />
              <span>Commandes</span>
            </Link>
            <Link href="/dashboard/messages" onClick={closeMenu} className={linkClass('/dashboard/messages')}>
              <MessageSquare size={20} className={pathname?.startsWith('/dashboard/messages') ? 'text-primary' : ''} />
              <span>Discussions</span>
            </Link>
            <Link href="/dashboard/calendar" onClick={closeMenu} className={linkClass('/dashboard/calendar')}>
              <Clock size={20} className={pathname?.startsWith('/dashboard/calendar') ? 'text-primary' : ''} />
              <span>Planning</span>
            </Link>
            {isAdmin && (
              <>
                <Link href="/dashboard/clients" onClick={closeMenu} className={linkClass('/dashboard/clients')}>
                  <Users size={20} className={pathname?.startsWith('/dashboard/clients') ? 'text-primary' : ''} />
                  <span>Partenaires</span>
                </Link>
                <Link href="/dashboard/portfolio" onClick={closeMenu} className={linkClass('/dashboard/portfolio')}>
                  <Briefcase size={20} className={pathname?.startsWith('/dashboard/portfolio') ? 'text-primary' : ''} />
                  <span>Portfolio</span>
                </Link>
                <Link href="/dashboard/reviews" onClick={closeMenu} className={linkClass('/dashboard/reviews')}>
                  <Star size={20} className={pathname?.startsWith('/dashboard/reviews') ? 'text-primary' : ''} />
                  <span>Avis</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {!isAdmin && (
          <div className="px-6 mt-4">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#4B5563] tracking-[0.15em] mb-4">RESSOURCES</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#23262F] flex items-center justify-center text-primary">
                  <BookOpen size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1F2937] dark:text-white">Guide Motion</span>
                  <span className="text-xs font-medium text-[#9CA3AF]">Lire la doc</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="px-6 mt-4 pt-4 border-t border-gray-50 dark:border-[#23262F]">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {profile.full_name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">{profile.full_name}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-[#6B7280] truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Settings & Dark Mode */}
      <div className="px-6 mt-2 pt-4 border-t border-gray-50 dark:border-[#23262F]">
        <h3 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#4B5563] tracking-[0.15em] mb-4">PARAMÈTRES</h3>
        <nav className="flex flex-col gap-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-4 px-4 py-3 text-[#9CA3AF] dark:text-[#6B7280] font-medium hover:text-[#1F2937] dark:hover:text-white transition-colors rounded-[16px] w-full text-left cursor-pointer"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
          </button>
          <Link
            href="/dashboard/settings"
            onClick={closeMenu}
            className="flex items-center gap-4 px-4 py-3 text-[#9CA3AF] dark:text-[#6B7280] font-medium hover:text-[#1F2937] dark:hover:text-white transition-colors rounded-[16px]"
          >
            <Settings size={20} />
            <span>Réglages</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-[#F15A59] font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left rounded-[16px] cursor-pointer"
          >
            <LogOut size={20} className="transform rotate-180" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
