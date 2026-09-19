import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../api/client'
import MediaCard from '../components/MediaCard'
import { STATUSES, STATUS_COLORS } from '../types'
import type { Media } from '../types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Media[]>([])
  const [library, setLibrary] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const [selected, setSelected] = useState<Media | null>(null)
  const [status, setStatus] = useState('Watching')
  const [progress, setProgress] = useState(0)
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const loadLibrary = () => {
    api.getLibrary().then((lib) => setLibrary(lib.map((i) => i.media_id)))
  }

  useEffect(() => {
    api.getMedia().then(setResults).catch(() => {})
    loadLibrary()
  }, [])

  const search = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = query.trim() ? await api.searchMedia(query) : await api.getMedia()
      setResults(res)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const openAdd = (media: Media) => {
    setSelected(media)
    setStatus('Watching')
    setProgress(0)
    setNotes('')
    setMessage('')
  }

  const addToLibrary = async () => {
    if (!selected) return
    setAdding(true)
    setMessage('')
    try {
      await api.addToLibrary({
        media_id: selected.id,
        status,
        progress,
        notes,
      })
      setMessage('✅ Added to library')
      loadLibrary()
    } catch (err) {
      const anyErr = err as { response?: { data?: { error?: string } } }
      setMessage(`❌ ${anyErr.response?.data?.error ?? 'Failed to add'}`)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-500">
        Searching…
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Search Media</h1>
      <p className="text-gray-500 mb-6">Find anime, movies & games to add to your library</p>

      <form onSubmit={search} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title… e.g. 'Demon Slayer'"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
        >
          Search
        </button>
      </form>

      {results.length === 0 && !loading ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-gray-600">No media found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search, or{' '}
            <a href="/add-media" className="text-purple-600 hover:underline">
              add it manually
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              action={
                library.includes(media.id) ? (
                  <span className="text-xs text-green-600 font-medium">✓ In your library</span>
                ) : (
                  <button
                    onClick={() => openAdd(media)}
                    className="w-full py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                  >
                    + Add to Library
                  </button>
                )
              }
            />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{selected.description}</p>

            {message && (
              <div className="text-sm mb-3 rounded-lg p-2 bg-gray-50 text-gray-700">{message}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-lg border border-gray-300 px-3 py-2 cursor-pointer ${STATUS_COLORS[status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress (episodes/hours)
                </label>
                <input
                  type="number"
                  min={0}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes…"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <button
                onClick={addToLibrary}
                disabled={adding}
                className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {adding ? 'Adding…' : 'Add to Library'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}