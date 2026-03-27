'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Profile, Order, Settings, Notification, ChatMessage, PortfolioBlock, PortfolioBlockType, Goal, Review, DayOff, WorkSchedule } from './types'
import { MOCK_PROFILES, MOCK_ORDERS, MOCK_SETTINGS, MOCK_NOTIFICATIONS, MOCK_PORTFOLIO_SETTINGS, MOCK_PORTFOLIO_PROJECTS, MOCK_MESSAGES, MOCK_PORTFOLIO_BLOCKS, MOCK_GOALS, MOCK_REVIEWS, MOCK_DAYS_OFF, MOCK_WORK_SCHEDULE } from './mock-data'
import type { PortfolioProject, PortfolioSettings } from './types'
import { getDefaultConfig } from './block-registry'
import { createClient } from './supabase/client'

interface StoreContextType {
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void

  // Auth
  currentUser: Profile | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, fullName: string, company: string, extra?: Partial<Profile>) => Promise<boolean>
  logout: () => Promise<void>
  switchUser: (userId: string) => void

  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'total_price' | 'status' | 'scheduled_start' | 'scheduled_end' | 'admin_notes'>) => void
  updateOrder: (id: string, updates: Partial<Order>) => void

  // Settings
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notif: Omit<Notification, 'id' | 'created_at' | 'read'>) => void
  markNotificationRead: (id: string) => void

  // Profiles
  profiles: Profile[]

  // Portfolio
  portfolioSettings: PortfolioSettings
  updatePortfolioSettings: (updates: Partial<PortfolioSettings>) => void
  portfolioProjects: PortfolioProject[]
  addPortfolioProject: (proj: Omit<PortfolioProject, 'id' | 'created_at'>) => void
  updatePortfolioProject: (id: string, updates: Partial<PortfolioProject>) => void
  deletePortfolioProject: (id: string) => void

  // Portfolio Blocks
  portfolioBlocks: PortfolioBlock[]
  addBlock: (type: PortfolioBlockType) => void
  removeBlock: (blockId: string) => void
  updateBlock: (blockId: string, updates: Partial<PortfolioBlock>) => void
  updateBlockConfig: (blockId: string, config: Record<string, unknown>) => void
  toggleBlock: (blockId: string) => void
  reorderBlock: (blockId: string, direction: 'up' | 'down') => void

  // Chat
  messages: ChatMessage[]
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) => void
  markMessagesAsRead: (senderId: string, receiverId: string) => void

  // Goals
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'created_at'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // Reviews
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'created_at'>) => void
  updateReview: (id: string, updates: Partial<Review>) => void
  deleteReview: (id: string) => void

  // Schedule
  daysOff: DayOff[]
  addDayOff: (dayOff: Omit<DayOff, 'id' | 'created_at'>) => void
  removeDayOff: (id: string) => void
  workSchedule: WorkSchedule[]
  updateWorkSchedule: (id: string, updates: Partial<WorkSchedule>) => void

  // Notifications helpers
  markAllNotificationsRead: (userId: string) => void

  // Profile
  updateProfile: (id: string, updates: Partial<Profile>) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', next)
      }
      return next
    })
  }, [])

  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES)
  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings>(MOCK_PORTFOLIO_SETTINGS)
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(MOCK_PORTFOLIO_PROJECTS)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [portfolioBlocks, setPortfolioBlocks] = useState<PortfolioBlock[]>(MOCK_PORTFOLIO_BLOCKS)
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS)
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [daysOff, setDaysOff] = useState<DayOff[]>(MOCK_DAYS_OFF)
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>(MOCK_WORK_SCHEDULE)

  const supabase = createClient()

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            setCurrentUser(profile as Profile)
          } else {
            // Fallback: create profile from auth data
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || '',
              company: user.user_metadata?.company || '',
              role: user.user_metadata?.role || 'client',
              created_at: user.created_at,
              updated_at: user.created_at,
            })
          }
        }
      } catch {
        // Supabase not configured or network error — continue with mock mode
      } finally {
        setAuthLoading(false)
      }
    }
    restoreSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
      } else if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setCurrentUser(profile as Profile)
        }
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Try Supabase auth first
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            setCurrentUser(profile as Profile)
          } else {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || '',
              company: user.user_metadata?.company || '',
              role: user.user_metadata?.role || 'client',
              created_at: user.created_at,
              updated_at: user.created_at,
            })
          }
          return true
        }
      }
    } catch {
      // Supabase not available, fall through to mock
    }

    // Fallback to mock profiles
    const user = profiles.find(p => p.email === email)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [profiles, supabase])

  const signup = useCallback(async (email: string, password: string, fullName: string, company: string, extra?: Partial<Profile>): Promise<boolean> => {
    // Try Supabase auth first
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company,
            role: 'client',
            ...extra,
          },
        },
      })
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            setCurrentUser(profile as Profile)
          } else {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              full_name: fullName,
              company,
              role: 'client',
              created_at: user.created_at,
              updated_at: user.created_at,
              ...extra,
            })
          }
          return true
        }
      }
    } catch {
      // Supabase not available, fall through to mock
    }

    // Fallback to mock
    if (profiles.find(p => p.email === email)) return false
    const newProfile: Profile = {
      id: `client-${Date.now()}`,
      email,
      full_name: fullName,
      company,
      role: 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...extra,
    }
    setProfiles(prev => [...prev, newProfile])
    setCurrentUser(newProfile)
    return true
  }, [profiles, supabase])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    setCurrentUser(null)
  }, [supabase])

  const switchUser = useCallback((userId: string) => {
    const user = profiles.find(p => p.id === userId)
    if (user) setCurrentUser(user)
  }, [profiles])

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'total_price' | 'status' | 'scheduled_start' | 'scheduled_end' | 'admin_notes'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      total_price: orderData.seconds_ordered * orderData.price_per_second,
      status: 'pending',
      scheduled_start: null,
      scheduled_end: null,
      admin_notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setOrders(prev => [newOrder, ...prev])
  }, [])

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o
    ))
  }, [])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }))
  }, [])

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications(prev => [newNotif, ...prev])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const updatePortfolioSettings = useCallback((updates: Partial<PortfolioSettings>) => {
    setPortfolioSettings((prev: PortfolioSettings) => ({ ...prev, ...updates }))
  }, [])

  const addPortfolioProject = useCallback((projData: Omit<PortfolioProject, 'id' | 'created_at'>) => {
    const newProj: PortfolioProject = {
      ...projData,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    setPortfolioProjects((prev: PortfolioProject[]) => [newProj, ...prev])
  }, [])

  const updatePortfolioProject = useCallback((id: string, updates: Partial<PortfolioProject>) => {
    setPortfolioProjects((prev: PortfolioProject[]) => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const deletePortfolioProject = useCallback((id: string) => {
    setPortfolioProjects((prev: PortfolioProject[]) => prev.filter(p => p.id !== id))
  }, [])

  const addBlock = useCallback((type: PortfolioBlockType) => {
    setPortfolioBlocks(prev => {
      const maxOrder = prev.reduce((m, b) => Math.max(m, b.order), -1)
      return [...prev, { id: `block-${Date.now()}`, type, enabled: true, order: maxOrder + 1, config: getDefaultConfig(type) }]
    })
  }, [])

  const removeBlock = useCallback((blockId: string) => {
    setPortfolioBlocks(prev => prev.filter(b => b.id !== blockId))
  }, [])

  const updateBlock = useCallback((blockId: string, updates: Partial<PortfolioBlock>) => {
    setPortfolioBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b))
  }, [])

  const updateBlockConfig = useCallback((blockId: string, config: Record<string, unknown>) => {
    setPortfolioBlocks(prev => prev.map(b => b.id === blockId ? { ...b, config: { ...b.config, ...config } } : b))
  }, [])

  const toggleBlock = useCallback((blockId: string) => {
    setPortfolioBlocks(prev => prev.map(b => b.id === blockId ? { ...b, enabled: !b.enabled } : b))
  }, [])

  const reorderBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setPortfolioBlocks(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(b => b.id === blockId)
      if (direction === 'up' && idx > 0) {
        const temp = sorted[idx].order
        sorted[idx] = { ...sorted[idx], order: sorted[idx - 1].order }
        sorted[idx - 1] = { ...sorted[idx - 1], order: temp }
      }
      if (direction === 'down' && idx < sorted.length - 1) {
        const temp = sorted[idx].order
        sorted[idx] = { ...sorted[idx], order: sorted[idx + 1].order }
        sorted[idx + 1] = { ...sorted[idx + 1], order: temp }
      }
      return sorted
    })
  }, [])

  const sendMessage = useCallback((msgData: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMsg])
  }, [])

  const markMessagesAsRead = useCallback((senderId: string, receiverId: string) => {
    setMessages(prev => prev.map(m =>
      (m.sender_id === senderId && m.receiver_id === receiverId && !m.read)
        ? { ...m, read: true } : m
    ))
  }, [])

  // Goals
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'created_at'>) => {
    const newGoal: Goal = { ...goalData, id: `goal-${Date.now()}`, created_at: new Date().toISOString() }
    setGoals(prev => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  // Reviews
  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'created_at'>) => {
    const newReview: Review = { ...reviewData, id: `review-${Date.now()}`, created_at: new Date().toISOString() }
    setReviews(prev => [newReview, ...prev])
  }, [])

  const updateReview = useCallback((id: string, updates: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }, [])

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id))
  }, [])

  // Schedule
  const addDayOff = useCallback((data: Omit<DayOff, 'id' | 'created_at'>) => {
    setDaysOff(prev => [...prev, { ...data, id: `dayoff-${Date.now()}`, created_at: new Date().toISOString() }])
  }, [])

  const removeDayOff = useCallback((id: string) => {
    setDaysOff(prev => prev.filter(d => d.id !== id))
  }, [])

  const updateWorkSchedule = useCallback((id: string, updates: Partial<WorkSchedule>) => {
    setWorkSchedule(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  // Mark all notifications read
  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications(prev => prev.map(n => n.user_id === userId ? { ...n, read: true } : n))
  }, [])

  // Update profile
  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    setCurrentUser(prev => prev && prev.id === id ? { ...prev, ...updates, updated_at: new Date().toISOString() } : prev)
  }, [])

  return (
    <StoreContext.Provider value={{
      darkMode, toggleDarkMode,
      currentUser, authLoading, login, signup, logout, switchUser,
      orders, addOrder, updateOrder,
      settings, updateSettings,
      notifications, addNotification, markNotificationRead,
      profiles,
      portfolioSettings, updatePortfolioSettings,
      portfolioProjects, addPortfolioProject, updatePortfolioProject, deletePortfolioProject,
      portfolioBlocks, addBlock, removeBlock, updateBlock, updateBlockConfig, toggleBlock, reorderBlock,
      messages, sendMessage, markMessagesAsRead,
      goals, addGoal, updateGoal, deleteGoal,
      reviews, addReview, updateReview, deleteReview,
      daysOff, addDayOff, removeDayOff, workSchedule, updateWorkSchedule,
      markAllNotificationsRead,
      updateProfile,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
