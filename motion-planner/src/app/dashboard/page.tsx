'use client'

import React from 'react';
import MainContent from '@/components/coursue/MainContent';
import RightSidebar from '@/components/coursue/RightSidebar';
import { useStore } from '@/lib/store'

export default function DashboardPage() {
  const { currentUser } = useStore()

  if (!currentUser) return null

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden">
      <MainContent profile={currentUser} />
      <RightSidebar profile={currentUser} />
    </div>
  );
}
