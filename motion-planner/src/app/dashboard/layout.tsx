'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import Sidebar, { MotionLogo } from '@/components/coursue/Sidebar'
import { Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser, authLoading } = useStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/login')
    }
  }, [currentUser, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFBFC] dark:bg-[#0F1117]">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser) return null

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAFBFC] dark:bg-[#0F1117] overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#181A20] border-b border-[#F3F4F6] dark:border-[#23262F] z-50">
        <div className="flex items-center gap-2">
           <MotionLogo className="w-8 h-8" />
           <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#1F2937] to-[#4B5563] dark:from-white dark:to-gray-400">Fahim AE</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-50 dark:bg-[#23262F] rounded-lg text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-[#2C2F38]">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-white dark:bg-[#181A20]' : 'hidden'} md:block md:relative h-full shrink-0`}>
        <Sidebar profile={currentUser} closeMenu={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {children}
      </div>
    </div>
  )
}
