import { useEffect, useState } from 'react'
import { api } from '../api/client'
import StatCard from '../components/StatCard'
import type { DashboardResponse } from '../types'

const genreColors = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-teal-600',
  'bg-orange-500',
  'bg-red-500',
]

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] animate-pulse">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-red-600">
        {error}
      </div>
    )
  }

  const genres = Object.entries(data.favorite_genres).sort((a, b) => b[1] - a[1])
  const maxGenre = genres[0]?.[1] ?? 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your media tracking overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Watching" value={data.total_watching} color="bg-blue-100 text-blue-800" />
        <StatCard label="Completed" value={data.total_completed} color="bg-green-100 text-green-800" />
        <StatCard label="Planned" value={data.total_planned} color="bg-purple-100 text-purple-800" />
        <StatCard label="Dropped" value={data.total_dropped} color="bg-red-100 text-red-800" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎭 Favorite Genres</h2>
        {genres.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No genres yet. Add media to your library to see genre stats.
          </p>
        ) : (
          <div className="space-y-3">
            {genres.map(([genre, count], i) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-28 text-right">{genre}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${genreColors[i % genreColors.length]}`}
                    style={{ width: `${(count / maxGenre) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}