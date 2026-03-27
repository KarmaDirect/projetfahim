import type { PortfolioBlockType } from './types'

export interface BlockMeta {
  type: PortfolioBlockType
  label: string
  description: string
  icon: string
  phase: 1 | 2
  category: 'showcase' | 'social_proof' | 'tools' | 'analytics' | 'interaction'
  dashboardOnly?: boolean
}

export const BLOCK_REGISTRY: Record<PortfolioBlockType, BlockMeta> = {
  showreel:            { type: 'showreel',            label: 'Showreel auto-généré',    description: 'Compile les premières secondes de chaque projet',   icon: 'Clapperboard',  phase: 1, category: 'showcase' },
  before_after:        { type: 'before_after',        label: 'Avant / Après',           description: 'Slider de comparaison brut vs final',               icon: 'Columns',       phase: 1, category: 'showcase' },
  filters:             { type: 'filters',             label: 'Filtres intelligents',     description: 'Filtrer par type, format, style, logiciel...',      icon: 'Filter',        phase: 1, category: 'showcase' },
  testimonial:         { type: 'testimonial',         label: 'Témoignages clients',      description: 'Avis client par projet avec mini-scores',           icon: 'Quote',         phase: 1, category: 'social_proof' },
  tech_stack:          { type: 'tech_stack',          label: 'Stack technique',          description: 'Logiciels maîtrisés + projets par outil',           icon: 'Wrench',        phase: 1, category: 'tools' },
  availability_widget: { type: 'availability_widget', label: 'Disponibilité',            description: 'Indicateur temps réel + délai moyen',               icon: 'Clock',         phase: 1, category: 'interaction' },
  project_breakdown:   { type: 'project_breakdown',   label: 'Décomposition projet',     description: 'Storyboard → Moodboard → Final',                    icon: 'Layers',        phase: 2, category: 'showcase' },
  chaptered_player:    { type: 'chaptered_player',    label: 'Player chapitré',          description: 'Marqueurs de technique sur la timeline',             icon: 'ListVideo',     phase: 2, category: 'showcase' },
  kpi_youtube:         { type: 'kpi_youtube',         label: 'KPI YouTube',              description: 'Vues, CTR, watch time par projet',                  icon: 'BarChart3',     phase: 2, category: 'analytics' },
  quote_calculator:    { type: 'quote_calculator',    label: 'Calculateur devis',        description: 'Estimation type × durée × complexité',              icon: 'Calculator',    phase: 2, category: 'interaction' },
  retention_heatmap:   { type: 'retention_heatmap',   label: 'Heat map rétention',       description: 'Courbe de rétention sur la timeline',                icon: 'Activity',      phase: 2, category: 'analytics' },
  immersive_playlist:  { type: 'immersive_playlist',  label: 'Playlist immersive',       description: 'Mode cinéma plein écran avec transitions',           icon: 'MonitorPlay',   phase: 2, category: 'showcase' },
  curated_collections: { type: 'curated_collections', label: 'Collections curées',       description: 'Playlists thématiques avec lien unique',             icon: 'FolderHeart',   phase: 2, category: 'showcase' },
  visitor_analytics:   { type: 'visitor_analytics',   label: 'Analytics visiteur',       description: 'Vues, temps passé, clics (dashboard)',               icon: 'Eye',           phase: 2, category: 'analytics', dashboardOnly: true },
  live_collaboration:  { type: 'live_collaboration',  label: 'Collaboration live',       description: 'Commentaires horodatés sur la timeline',             icon: 'MessageCircle', phase: 2, category: 'interaction' },
}

export function getDefaultConfig(type: PortfolioBlockType): Record<string, unknown> {
  switch (type) {
    case 'showreel':
      return { clip_duration_seconds: 3, transition_style: 'crossfade', project_ids: [] }
    case 'before_after':
      return { items: [] }
    case 'filters':
      return { enabled_filters: ['type', 'format', 'style', 'software'] }
    case 'testimonial':
      return { testimonials: [] }
    case 'tech_stack':
      return { tools: [] }
    case 'availability_widget':
      return { status: 'available', next_available_date: null, average_delivery_days: 5, message: 'Disponible pour de nouveaux projets' }
    default:
      return {}
  }
}

export const PHASE_1_BLOCK_TYPES: PortfolioBlockType[] = [
  'showreel', 'filters', 'before_after', 'testimonial', 'tech_stack', 'availability_widget'
]
