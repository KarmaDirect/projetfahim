'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Profile, Order, Settings, Notification, ChatMessage, PortfolioBlock, PortfolioBlockType, Goal, Review, DayOff, WorkSchedule, OrderAttachment } from './types'
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
  addOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'total_price' | 'status' | 'scheduled_start' | 'scheduled_end' | 'admin_notes'>) => Promise<Order | null>
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

  // Order Attachments
  orderAttachments: OrderAttachment[]
  addOrderAttachment: (orderId: string, file?: File, url?: string, fileName?: string) => Promise<void>
  removeOrderAttachment: (id: string) => Promise<void>
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
  const [orderAttachments, setOrderAttachments] = useState<OrderAttachment[]>([])

  const [supabase] = useState(() => createClient())

  // Load real data from Supabase when a real user logs in
  const loadSupabaseData = useCallback(async (userId: string, userRole: string) => {
    // Load profiles (admin sees all, client sees self + admin)
    const { data: dbProfiles } = await supabase.from('profiles').select('*')
    if (dbProfiles && dbProfiles.length > 0) {
      setProfiles(dbProfiles as Profile[])
    }

    // Load orders
    const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (dbOrders) {
      setOrders(dbOrders as Order[])
    } else {
      setOrders([])
    }

    // Load settings
    const { data: dbSettings } = await supabase.from('settings').select('*').limit(1).single()
    if (dbSettings) {
      setSettings(dbSettings as Settings)
    }

    // Load notifications
    const { data: dbNotifs } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (dbNotifs) {
      setNotifications(dbNotifs as Notification[])
    } else {
      setNotifications([])
    }

    // Load messages
    const { data: dbMessages } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
    if (dbMessages) {
      setMessages(dbMessages as ChatMessage[])
    } else {
      setMessages([])
    }

    // Load optional tables (may not exist yet) - don't let failures block other data
    try {
      const { data: dbGoals } = await supabase.from('goals').select('*').order('created_at', { ascending: false })
      if (dbGoals) setGoals(dbGoals as Goal[])
    } catch { /* table may not exist */ }

    try {
      const { data: dbReviews } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
      if (dbReviews) setReviews(dbReviews as Review[])
    } catch { /* table may not exist */ }

    try {
      const { data: dbDaysOff } = await supabase.from('days_off').select('*').order('created_at', { ascending: false })
      if (dbDaysOff) setDaysOff(dbDaysOff as DayOff[])
    } catch { /* table may not exist */ }

    try {
      const { data: dbWorkSchedule } = await supabase.from('work_schedule').select('*')
      if (dbWorkSchedule) setWorkSchedule(dbWorkSchedule as WorkSchedule[])
    } catch { /* table may not exist */ }

    // Load order attachments
    const { data: dbAttachments } = await supabase.from('order_attachments').select('*').order('created_at', { ascending: false })
    if (dbAttachments) {
      setOrderAttachments(dbAttachments as OrderAttachment[])
    } else {
      setOrderAttachments([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Session management
  // getSession() reads from localStorage (no network, no lock conflict)
  // onAuthStateChange handles sign in/out events after initial load
  useEffect(() => {
    let mounted = true

    const loadUserProfile = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const meta = user.user_metadata || {}
      const role = (profile?.role || meta.role || 'client') as Profile['role']
      const userProfile: Profile = profile ? (profile as Profile) : {
        id: user.id,
        email: user.email || '',
        full_name: String(meta.full_name || ''),
        company: String(meta.company || ''),
        role,
        created_at: user.created_at,
        updated_at: user.created_at,
      }
      if (!mounted) return
      setCurrentUser(userProfile)
      try {
        await loadSupabaseData(user.id, userProfile.role)
      } catch (loadErr) {
        console.error('[Fahim AE] loadSupabaseData error (non-blocking):', loadErr)
      }
    }

    // 1. Immediate restore from local session (no network call, no lock)
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          await loadUserProfile(session.user)
        }
      } catch (err) {
        console.error('[Fahim AE] getSession error:', err)
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }
    restoreSession()

    // 2. Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
        setProfiles(MOCK_PROFILES)
        setOrders(MOCK_ORDERS)
        setMessages(MOCK_MESSAGES)
        setNotifications(MOCK_NOTIFICATIONS)
        setSettings(MOCK_SETTINGS)
        setGoals(MOCK_GOALS)
        setReviews(MOCK_REVIEWS)
        setDaysOff(MOCK_DAYS_OFF)
        setWorkSchedule(MOCK_WORK_SCHEDULE)
        setPortfolioSettings(MOCK_PORTFOLIO_SETTINGS)
        setPortfolioProjects(MOCK_PORTFOLIO_PROJECTS)
        setPortfolioBlocks(MOCK_PORTFOLIO_BLOCKS)
        setOrderAttachments([])
      } else if (event === 'SIGNED_IN') {
        // Reload session after sign in (login was already handled by login(), but this catches OAuth etc)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          await loadUserProfile(session.user)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realtime subscription for messages
  useEffect(() => {
    if (!currentUser || currentUser.id.startsWith('client-')) return

    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload: { new: Record<string, unknown> }) => {
        const newMsg = payload.new as unknown as ChatMessage
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev
          return [...prev, newMsg]
        })
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      }, (payload: { new: Record<string, unknown> }) => {
        const updated = payload.new as unknown as ChatMessage
        setMessages(prev => prev.map(m => m.id === updated.id ? updated : m))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || data.user.user_metadata?.role || 'client'
        const userProfile: Profile = profile ? (profile as Profile) : {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || '',
            company: data.user.user_metadata?.company || '',
            role: role as Profile['role'],
            created_at: data.user.created_at,
            updated_at: data.user.created_at,
          }
        setCurrentUser(userProfile)
        try {
          await loadSupabaseData(data.user.id, userProfile.role)
        } catch (loadErr) {
          console.error('[Fahim AE] loadSupabaseData error (non-blocking):', loadErr)
        }
        return true
      }
      if (error) {
        throw new Error('Email ou mot de passe incorrect.')
      }
    } catch (err) {
      // If it's our own thrown error, re-throw it
      if (err instanceof Error && err.message === 'Email ou mot de passe incorrect.') {
        throw err
      }
      // Supabase not reachable — allow mock fallback
      console.error('[Fahim AE] Login error, falling back to mock:', err)
      const user = profiles.find(p => p.email === email)
      if (user) {
        setCurrentUser(user)
        return true
      }
    }
    return false
  }, [profiles, supabase, loadSupabaseData])

  const signup = useCallback(async (email: string, password: string, fullName: string, company: string, extra?: Partial<Profile>): Promise<boolean> => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company,
            role: extra?.role || 'client',
          },
        },
      })
      if (!error && data.user) {
        // Wait for the trigger to create the profile, with retry
        let profile = null
        for (let i = 0; i < 3; i++) {
          await new Promise(r => setTimeout(r, 500))
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
          if (p) { profile = p; break }
        }

        // Update profile with extra fields (user_type, specialty, phone, etc.)
        if (profile && extra) {
          const extraFields: Record<string, unknown> = {}
          for (const [key, value] of Object.entries(extra)) {
            if (value !== undefined && !['id', 'email', 'role', 'created_at', 'updated_at'].includes(key)) {
              extraFields[key] = value
            }
          }
          if (Object.keys(extraFields).length > 0) {
            await supabase.from('profiles').update(extraFields).eq('id', data.user.id)
            profile = { ...profile, ...extraFields }
          }
        }

        const userProfile: Profile = profile ? (profile as Profile) : {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName,
            company,
            role: (extra?.role || 'client') as Profile['role'],
            created_at: data.user.created_at,
            updated_at: data.user.created_at,
            ...extra,
          }
        setCurrentUser(userProfile)
        await loadSupabaseData(data.user.id, userProfile.role)
        return true
      }
      if (error) {
        // Rate limit (429)
        if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
          throw new Error('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.')
        }
        // Email already registered
        if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already been registered')) {
          throw new Error('Un compte existe déjà avec cet email.')
        }
        throw new Error(error.message || 'Erreur lors de la création du compte.')
      }
    } catch (err) {
      // If it's our own thrown error, re-throw it
      if (err instanceof Error && (
        err.message.includes('Trop de tentatives') ||
        err.message.includes('existe déjà') ||
        err.message.includes('Erreur lors')
      )) {
        throw err
      }
      // Supabase not reachable — allow mock fallback
      if (profiles.find(p => p.email === email)) {
        throw new Error('Un compte existe déjà avec cet email.')
      }
      const newProfile: Profile = {
        id: `client-${Date.now()}`,
        email,
        full_name: fullName,
        company,
        role: (extra?.role || 'client') as Profile['role'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...extra,
      }
      setProfiles(prev => [...prev, newProfile])
      setCurrentUser(newProfile)
      return true
    }
    return false
  }, [profiles, supabase, loadSupabaseData])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore — signOut may fail if Supabase is unreachable
    }
    setCurrentUser(null)
    setProfiles(MOCK_PROFILES)
    setOrders(MOCK_ORDERS)
    setMessages(MOCK_MESSAGES)
    setNotifications(MOCK_NOTIFICATIONS)
    setSettings(MOCK_SETTINGS)
    setGoals(MOCK_GOALS)
    setReviews(MOCK_REVIEWS)
    setDaysOff(MOCK_DAYS_OFF)
    setWorkSchedule(MOCK_WORK_SCHEDULE)
    setPortfolioSettings(MOCK_PORTFOLIO_SETTINGS)
    setPortfolioProjects(MOCK_PORTFOLIO_PROJECTS)
    setPortfolioBlocks(MOCK_PORTFOLIO_BLOCKS)
    setOrderAttachments([])
  }, [supabase])

  const switchUser = useCallback((userId: string) => {
    const user = profiles.find(p => p.id === userId)
    if (user) setCurrentUser(user)
  }, [profiles])

  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'total_price' | 'status' | 'scheduled_start' | 'scheduled_end' | 'admin_notes'>): Promise<Order | null> => {
    // Try Supabase first
    if (currentUser && !currentUser.id.startsWith('client-')) {
      const { data, error } = await supabase.from('orders').insert({
        client_id: orderData.client_id,
        client_name: orderData.client_name,
        project_name: orderData.project_name,
        description: orderData.description,
        seconds_ordered: orderData.seconds_ordered,
        price_per_second: orderData.price_per_second,
        production_days: orderData.production_days,
        deadline: orderData.deadline,
      }).select().single()
      if (!error && data) {
        const order = data as Order
        setOrders(prev => [order, ...prev])
        return order
      }
    }
    // Fallback to local
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
    return newOrder
  }, [currentUser, supabase])

  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    // Try Supabase first
    if (currentUser && !id.startsWith('order-')) {
      const { total_price, ...safeUpdates } = updates as Record<string, unknown>
      void total_price
      await supabase.from('orders').update(safeUpdates).eq('id', id)
    }
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o
    ))
  }, [currentUser, supabase])

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    if (currentUser && !currentUser.id.startsWith('client-')) {
      await supabase.from('settings').update(updates).eq('id', settings.id)
    }
    setSettings(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }))
  }, [currentUser, supabase, settings.id])

  const addNotification = useCallback(async (notif: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (currentUser && !currentUser.id.startsWith('client-')) {
      const { data } = await supabase.from('notifications').insert({
        user_id: notif.user_id,
        title: notif.title,
        message: notif.message,
        order_id: notif.order_id,
      }).select().single()
      if (data) {
        setNotifications(prev => [data as Notification, ...prev])
        return
      }
    }
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications(prev => [newNotif, ...prev])
  }, [currentUser, supabase])

  const markNotificationRead = useCallback(async (id: string) => {
    if (!id.startsWith('notif-')) {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
    }
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }, [supabase])

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

  const sendMessage = useCallback(async (msgData: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) => {
    if (currentUser && !currentUser.id.startsWith('client-')) {
      const { data, error } = await supabase.from('messages').insert({
        sender_id: msgData.sender_id,
        receiver_id: msgData.receiver_id,
        content: msgData.content,
      }).select().single()
      if (error) {
        console.error('[Fahim AE] Message insert error:', error)
      }
      if (data) {
        setMessages(prev => [...prev, data as ChatMessage])
        return
      }
    }
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMsg])
  }, [currentUser, supabase])

  const markMessagesAsRead = useCallback(async (senderId: string, receiverId: string) => {
    if (currentUser && !currentUser.id.startsWith('client-')) {
      await supabase.from('messages').update({ read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .eq('read', false)
    }
    setMessages(prev => prev.map(m =>
      (m.sender_id === senderId && m.receiver_id === receiverId && !m.read)
        ? { ...m, read: true } : m
    ))
  }, [currentUser, supabase])

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
  const markAllNotificationsRead = useCallback(async (userId: string) => {
    if (!userId.startsWith('client-')) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
    }
    setNotifications(prev => prev.map(n => n.user_id === userId ? { ...n, read: true } : n))
  }, [supabase])

  // Update profile
  const updateProfile = useCallback(async (id: string, updates: Partial<Profile>) => {
    if (!id.startsWith('client-')) {
      await supabase.from('profiles').update(updates).eq('id', id)
    }
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    setCurrentUser(prev => prev && prev.id === id ? { ...prev, ...updates, updated_at: new Date().toISOString() } : prev)
  }, [supabase])

  // Order Attachments
  const addOrderAttachment = useCallback(async (orderId: string, file?: File, url?: string, fileName?: string) => {
    let fileUrl = url || ''
    let fileType: 'image' | 'link' | 'document' = 'link'
    let fileSize: number | null = null
    let finalFileName = fileName || url || ''

    if (file) {
      finalFileName = file.name
      fileSize = file.size
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      fileType = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) ? 'image' : 'document'

      const path = `${orderId}/${Date.now()}_${file.name}`
      if (currentUser && !currentUser.id.startsWith('client-')) {
        const { error: uploadError } = await supabase.storage.from('order-attachments').upload(path, file)
        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('order-attachments').getPublicUrl(path)
          fileUrl = publicData.publicUrl
        }
      } else {
        fileUrl = URL.createObjectURL(file)
      }
    }

    if (currentUser && !currentUser.id.startsWith('client-')) {
      const { data, error } = await supabase.from('order_attachments').insert({
        order_id: orderId,
        uploaded_by: currentUser.id,
        file_name: finalFileName,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
      }).select().single()
      if (!error && data) {
        setOrderAttachments(prev => [data as OrderAttachment, ...prev])
        return
      }
    }

    // Fallback local
    const newAttachment: OrderAttachment = {
      id: `attach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      order_id: orderId,
      uploaded_by: currentUser?.id || '',
      file_name: finalFileName,
      file_url: fileUrl,
      file_type: fileType,
      file_size: fileSize,
      created_at: new Date().toISOString(),
    }
    setOrderAttachments(prev => [newAttachment, ...prev])
  }, [currentUser, supabase])

  const removeOrderAttachment = useCallback(async (id: string) => {
    if (!id.startsWith('attach-')) {
      await supabase.from('order_attachments').delete().eq('id', id)
    }
    setOrderAttachments(prev => prev.filter(a => a.id !== id))
  }, [supabase])

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
      orderAttachments, addOrderAttachment, removeOrderAttachment,
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
