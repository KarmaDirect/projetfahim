import React, { useState, useMemo } from 'react';
import { Plus, Target, Edit3, Check, X } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function RightSidebar({ profile }: { profile: Profile }) {
  const { orders, profiles, goals, updateGoal } = useStore();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const filteredOrders = profile.role === 'admin'
    ? orders
    : orders.filter(o => o.client_id === profile.id);

  const userGoal = goals.find(g => g.user_id === profile.id) || goals[0];
  const goalTarget = userGoal?.target_seconds || 500;

  const totalSeconds = filteredOrders
    .filter(o => o.status !== 'rejected' && o.status !== 'pending')
    .reduce((sum, o) => sum + o.seconds_ordered, 0);

  const progressPercent = Math.min(Math.round((totalSeconds / goalTarget) * 100), 100);
  const strokeDash = 283;
  const strokeOffset = strokeDash - ((progressPercent / 100) * strokeDash);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; seconds: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekSeconds = filteredOrders
        .filter(o => {
          if (o.status === 'rejected' || !o.scheduled_start) return false;
          const start = new Date(o.scheduled_start);
          return start >= weekStart && start <= weekEnd;
        })
        .reduce((sum, o) => sum + o.seconds_ordered, 0);

      weeks.push({ label: `S${4 - i}`, seconds: weekSeconds });
    }
    return weeks;
  }, [filteredOrders]);

  const maxWeekSeconds = Math.max(...weeklyData.map(w => w.seconds), 1);

  function handleGoalSave() {
    const val = parseInt(goalInput);
    if (val > 0 && userGoal) {
      updateGoal(userGoal.id, { target_seconds: val });
    }
    setEditingGoal(false);
  }

  return (
    <aside className="w-[320px] flex flex-col h-full bg-white dark:bg-[#181A20] border-l border-[#F3F4F6] dark:border-[#23262F] shrink-0 p-6 overflow-y-auto transition-colors duration-300">
      {/* Objective */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Objectif Production</h2>
          <button
            onClick={() => { setEditingGoal(true); setGoalInput(String(goalTarget)); }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {editingGoal && (
          <div className="flex items-center gap-2 mb-6 bg-gray-50 dark:bg-[#23262F] rounded-[16px] p-3">
            <Target size={16} className="text-gray-500 shrink-0" />
            <input
              type="number"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-[#1F2937] dark:text-white outline-none w-0"
              placeholder="Objectif en secondes"
              min="1"
            />
            <span className="text-xs text-gray-400 shrink-0">sec</span>
            <button onClick={handleGoalSave} className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg cursor-pointer"><Check size={16} /></button>
            <button onClick={() => setEditingGoal(false)} className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2F38] rounded-lg cursor-pointer"><X size={16} /></button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mb-8 relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#F3F4F6] dark:text-[#23262F]" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="text-primary dark:text-gray-300 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 m-auto w-[68px] h-[68px] rounded-full overflow-hidden border-2 border-white dark:border-[#23262F] shadow-xl bg-gray-100 dark:bg-[#23262F] flex items-center justify-center text-xl font-bold text-primary dark:text-white uppercase">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.email?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute top-0 right-0 bg-white dark:bg-[#23262F] shadow-sm rounded-[14px] px-3 py-1 border border-gray-50 dark:border-[#2C2F38]">
              <span className="text-xs font-bold text-primary dark:text-white">{progressPercent}%</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-[17px] font-bold text-[#1F2937] dark:text-white mb-1 flex items-center justify-center gap-1.5">
            {progressPercent >= 100 ? 'Objectif atteint' : 'Beau travail'} {profile.full_name?.split(' ')[0] || profile.email?.split('@')[0]} <span>{progressPercent >= 100 ? '🎉' : '🔥'}</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] font-medium px-4">
            {totalSeconds}s / {goalTarget}s — {userGoal?.period === 'weekly' ? 'cette semaine' : 'ce mois'}
          </p>
        </div>

        {/* Bar chart */}
        <div className="bg-[#F3F4F6] dark:bg-[#23262F] rounded-[24px] p-6 border border-[#F3F4F6] dark:border-[#2C2F38]">
          <div className="flex items-end justify-between h-[100px] mb-4 gap-3 relative">
            {weeklyData.map((week, i) => {
              const heightPct = maxWeekSeconds > 0 ? Math.max((week.seconds / maxWeekSeconds) * 100, 4) : 4;
              const isCurrentWeek = i === weeklyData.length - 1;
              return (
                <div key={i} className="w-full flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-bold text-[#9CA3AF]">{week.seconds}s</span>
                  <div
                    className={`w-full rounded-t-[10px] transition-all ${isCurrentWeek ? 'bg-primary dark:bg-white' : 'bg-[#D1D5DB] dark:bg-[#4B5563]'}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
            <div className="absolute left-0 top-0 w-full h-px border-t border-dashed border-gray-200 dark:border-[#4B5563]" />
            <div className="absolute left-0 top-[50%] w-full h-px border-t border-dashed border-gray-200 dark:border-[#4B5563]" />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF] mt-3 uppercase tracking-wider">
            {weeklyData.map((w, i) => <span key={i}>{w.label}</span>)}
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Support Team</h2>
          <Link href="/dashboard/messages" className="w-6 h-6 rounded-full border border-gray-200 dark:border-[#2C2F38] flex items-center justify-center text-primary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23262F] transition-colors">
            <Plus size={14} strokeWidth={3} />
          </Link>
        </div>

        <div className="bg-[#F3F4F6] dark:bg-[#23262F] rounded-[24px] p-2 flex flex-col gap-1 mb-4 border border-[#F3F4F6] dark:border-[#2C2F38]">
          {(() => {
            const teamMembers = profile.role === 'admin'
              ? profiles.filter(p => p.role === 'client').slice(0, 4).map(p => ({
                  name: p.full_name || p.email,
                  role: "Partenaire",
                  initial: (p.full_name || p.email)[0].toUpperCase(),
                  status: "offline"
                }))
              : profiles.filter(p => p.role === 'admin').map(p => ({
                  name: p.full_name || p.email,
                  role: "Motion Designer",
                  initial: (p.full_name || p.email)[0].toUpperCase(),
                  status: "online"
                }));

            return teamMembers.map((member, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-[16px] bg-[#F3F4F6] dark:bg-[#23262F] hover:bg-white dark:hover:bg-[#181A20] transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-[12px] bg-gray-100 dark:bg-[#2C2F38] flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-sm">
                    {member.initial}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#23262F] ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#1F2937] dark:text-white tracking-tight">{member.name}</span>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{member.role}</span>
                </div>
              </div>
            </div>
            ));
          })()}
        </div>

        <Link href="/dashboard/messages" className="block w-full py-4 rounded-[20px] bg-gray-50 dark:bg-[#23262F] text-primary dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-[#2C2F38] transition-colors shadow-sm dark:shadow-none text-sm text-center">
          Contacter l&apos;équipe
        </Link>
      </div>
    </aside>
  );
}
