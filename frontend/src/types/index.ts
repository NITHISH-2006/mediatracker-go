export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Media {
  id: string
  title: string
  media_type: 'anime' | 'movie' | 'game'
  year: number
  genres: string[]
  description: string
  created_at: string
}

export interface LibraryItem {
  id: string
  user_id: string
  media_id: string
  status: 'Watching' | 'Completed' | 'Dropped' | 'Planned'
  progress: number
  notes: string
  added_at: string
  updated_at: string
}

export interface LoginResponse {
  token: string
  expires_in: number
}

export interface DashboardResponse {
  total_completed: number
  total_watching: number
  total_planned: number
  total_dropped: number
  favorite_genres: Record<string, number>
  library_summary: Record<string, number>
}

export interface RecommendedItem {
  id: string
  title: string
  media_type: string
  genres: string[]
  match_reason: string
}

export interface RecommendationResponse {
  recommended_media: RecommendedItem[]
}

export interface AddMediaRequest {
  title: string
  media_type: string
  year: number
  genres: string[]
  description?: string
}

export interface AddToLibraryRequest {
  media_id: string
  status: string
  progress?: number
  notes?: string
}

export interface UpdateLibraryRequest {
  status?: string
  progress?: number
  notes?: string
}

export const STATUSES = ['Watching', 'Completed', 'Dropped', 'Planned'] as const
export const MEDIA_TYPES = ['anime', 'movie', 'game'] as const

export const STATUS_COLORS: Record<string, string> = {
  Watching: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Dropped: 'bg-red-100 text-red-700',
  Planned: 'bg-purple-100 text-purple-700',
}

export const TYPE_BADGES: Record<string, string> = {
  anime: 'bg-pink-100 text-pink-700',
  movie: 'bg-indigo-100 text-indigo-700',
  game: 'bg-teal-100 text-teal-700',
}