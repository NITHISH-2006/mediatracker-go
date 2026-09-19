import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { STATUS_COLORS, STATUSES, TYPE_BADGES } from '../types'
import type { LibraryItem, Media } from '../types'

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})
  const [tab, setTab] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([api.getLibrary(), api.getMedia()])
      .then(([lib, media]) => {
        setItems(lib)
        const map: Record<string, Media> = {}
        media.forEach((m) => (map[m.id] = m))
        setMediaMap(map)
      })
      .catch(() => setError('Failed to load library'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(
    () => (tab === 'All' ? items : items.filter((i) => i.status === tab)),
    [items, tab]
  )

  const updateStatus = async (item: LibraryItem, status: string) => {
    await api.updateLibraryItem(item.id, { status, progress: item.progress, notes: item.notes })
    load()
  }

  const updateProgress = async (item: LibraryItem, progress: number) => {
    await api.updateLibraryItem(item.id, { status: item.status, progress, notes: item.notes })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this item from your library?')) return
    await api.deleteLibraryItem(id)
    load()
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] animate-pulse">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">My Library</h1>
      <p className="text-gray-500 mb-6">Manage everything you're tracking</p>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              tab === s
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-3xl mb-3">🗂️</p>
          <p className="text-gray-600">No items in this list yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Head to <a href="/search" className="text-purple-600 hover:underline">Search</a> to add media
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const media = mediaMap[item.media_id]
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {media?.title ?? 'Unknown media'}
                    </h3>
                    {media && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGES[media.media_type]}`}
                      >
                        {media.media_type}
                      </span>
                    )}
                  </div>
                  {media && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {media.genres.join(', ')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">"{item.notes}"</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg font-medium border-0 ${STATUS_COLORS[item.status]} cursor-pointer`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500">
                      Progress:{' '}
                      <input
                        type="number"
                        min={0}
                        value={item.progress}
                        onChange={(e) => updateProgress(item, Number(e.target.value))}
                        className="w-16 px-2 py-0.5 rounded border border-gray-300 text-sm"
                      />
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="text-gray-400 hover:text-red-600 transition text-lg"
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}