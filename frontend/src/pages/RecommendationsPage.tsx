import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { TYPE_BADGES } from '../types'
import type { RecommendedItem } from '../types'

export default function RecommendationsPage() {
  const [items, setItems] = useState<RecommendedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getRecommendations()
      .then((res) => setItems(res.recommended_media ?? []))
      .catch(() => setError('Failed to load recommendations'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] animate-pulse">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">✨ Recommendations</h1>
      <p className="text-gray-500 mb-8">Picked for you based on what you watch</p>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {!error && items.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-3xl mb-3">🔮</p>
          <p className="text-gray-600">No recommendations yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add some media to your library (Completed or Watching) and we'll suggest similar titles
          </p>
          <Link
            to="/search"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
          >
            Go to Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGES[item.media_type]}`}
                >
                  {item.media_type}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.genres.map((g) => (
                  <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
              <div className="mt-auto bg-purple-50 text-purple-700 text-sm rounded-lg px-3 py-2">
                💡 {item.match_reason}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}