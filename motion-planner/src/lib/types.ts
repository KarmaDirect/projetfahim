export interface Profile {
  id: string
  email: string
  full_name: string
  company: string
  role: 'admin' | 'client' | 'partner'
  user_type?: 'partner' | 'client_direct'
  specialty?: string
  monthly_volume?: string
  tools?: string[]
  project_type?: string
  budget_range?: string
  phone?: string
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  client_id: string
  client_name: string
  project_name: string
  description: string
  seconds_ordered: number
  price_per_second: number
  total_price: number
  production_days: number
  deadline: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  scheduled_start: string | null
  scheduled_end: string | null
  admin_notes: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Settings {
  id: string
  price_per_second: number
  seconds_per_day: number
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  order_id: string | null
  created_at: string
}

export interface PortfolioProject {
  id: string
  title: string
  category: string
  client: string
  media_url: string
  media_type: 'image' | 'video'
  format: 'short' | 'long'
  created_at: string
  description?: string
  duration_seconds?: number
  software_used?: string[]
  audience?: string
  style?: string
  thumbnail_url?: string
  before_url?: string
  // KPIs
  views?: number
  likes?: number
  watch_time_avg?: number // en secondes
  ctr?: number // pourcentage
  retention_rate?: number // pourcentage
  platform?: string
}

export interface PortfolioSettings {
  background_color: string
  ambient_music_url: string | null
  hero_title?: string
  hero_subtitle?: string
  cta_text?: string
  cta_url?: string
}

// ===== PORTFOLIO BLOCK SYSTEM =====

export type PortfolioBlockType =
  | 'showreel'
  | 'before_after'
  | 'filters'
  | 'testimonial'
  | 'tech_stack'
  | 'availability_widget'
  | 'project_breakdown'
  | 'chaptered_player'
  | 'kpi_youtube'
  | 'quote_calculator'
  | 'retention_heatmap'
  | 'immersive_playlist'
  | 'curated_collections'
  | 'visitor_analytics'
  | 'live_collaboration'

export interface PortfolioBlock {
  id: string
  type: PortfolioBlockType
  enabled: boolean
  order: number
  config: Record<string, unknown>
}

// Phase 1 block configs

export interface ShowreelConfig {
  clip_duration_seconds: number
  transition_style: 'cut' | 'crossfade' | 'wipe'
  project_ids: string[]
}

export interface BeforeAfterConfig {
  items: { id: string; project_id: string; before_url: string; after_url: string; label: string }[]
}

export interface FiltersConfig {
  enabled_filters: ('type' | 'format' | 'audience' | 'style' | 'software')[]
}

export interface TestimonialConfig {
  testimonials: ProjectTestimonial[]
}

export interface ProjectTestimonial {
  id: string
  project_id: string
  client_name: string
  client_photo_url: string
  client_role: string
  quote: string
  scores: { label: string; value: number }[]
}

export interface TechStackConfig {
  tools: TechTool[]
}

export interface TechTool {
  id: string
  name: string
  icon_url: string
  category: string
  proficiency: number
  project_count: number
}

export interface AvailabilityWidgetConfig {
  status: 'available' | 'busy' | 'unavailable'
  next_available_date: string | null
  average_delivery_days: number
  message: string
}

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

// ===== GOALS SYSTEM =====

export interface Goal {
  id: string
  user_id: string
  title: string
  target_seconds: number
  period: 'weekly' | 'monthly'
  created_at: string
}

// ===== SCHEDULE SYSTEM =====

export interface DayOff {
  id: string
  date: string // YYYY-MM-DD
  label: string // ex: "Vacances", "Férié", "Perso"
  created_at: string
}

export interface WorkSchedule {
  id: string
  // 0=dimanche, 1=lundi ... 6=samedi
  day_of_week: number
  is_working: boolean
  start_hour: string // "09:00"
  end_hour: string   // "18:00"
}

// ===== REVIEWS SYSTEM =====

export interface Review {
  id: string
  client_id: string
  client_name: string
  order_id: string | null
  project_name: string
  content: string
  rating: number
  created_at: string
}
