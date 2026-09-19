import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { MEDIA_TYPES } from '../types'
import { AxiosError } from 'axios'

export default function AddMediaPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [mediaType, setMediaType] = useState('anime')
  const [year, setYear] = useState(new Date().getFullYear())
  const [genres, setGenres] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const genreList = genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
      if (genreList.length === 0) {
        throw new Error('At least one genre is required')
      }
      await api.addMedia({
        title,
        media_type: mediaType,
        year: Number(year),
        genres: genreList,
        description,
      })
      navigate('/search')
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to add media')
      } else {
        setError((err as Error).message || 'Failed to add media')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Add New Media</h1>
        <p className="text-center text-gray-500 mt-2">
          Add an anime, movie or game to the catalog
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Attack on Titan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 cursor-pointer"
              >
                {MEDIA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                required
                min={1900}
                max={new Date().getFullYear() + 5}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Genres (comma-separated)
            </label>
            <input
              type="text"
              required
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="action, fantasy, drama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Short description…"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Adding…' : 'Add Media'}
          </button>
        </form>
      </div>
    </div>
  )
}