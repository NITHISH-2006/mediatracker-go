import axios from 'axios'
import type {
  AddMediaRequest,
  AddToLibraryRequest,
  DashboardResponse,
  LibraryItem,
  LoginResponse,
  Media,
  RecommendationResponse,
  UpdateLibraryRequest,
  User,
} from '../types'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const client = axios.create({ baseURL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string }) =>
    client.post<User>('/api/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    client.post<LoginResponse>('/api/auth/login', data).then((r) => r.data),

  // Media
  getMedia: () => client.get<Media[]>('/api/media').then((r) => r.data),
  searchMedia: (query: string) =>
    client.get<Media[]>('/api/media/search', { params: { query } }).then((r) => r.data),
  addMedia: (data: AddMediaRequest) =>
    client.post<Media>('/api/media', data).then((r) => r.data),

  // Library
  getLibrary: () => client.get<LibraryItem[]>('/api/library').then((r) => r.data),
  addToLibrary: (data: AddToLibraryRequest) =>
    client.post<LibraryItem>('/api/library', data).then((r) => r.data),
  updateLibraryItem: (id: string, data: UpdateLibraryRequest) =>
    client.put<LibraryItem>(`/api/library/${id}`, data).then((r) => r.data),
  deleteLibraryItem: (id: string) => client.delete(`/api/library/${id}`).then((r) => r.data),

  // Recommendations
  getRecommendations: () =>
    client.get<RecommendationResponse>('/api/recommendations').then((r) => r.data),

  // Dashboard
  getDashboard: () => client.get<DashboardResponse>('/api/dashboard').then((r) => r.data),
}

export default client