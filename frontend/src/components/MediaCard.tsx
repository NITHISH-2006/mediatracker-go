import { Link } from 'react-router-dom'
import { TYPE_BADGES } from '../types'
import type { Media } from '../types'

interface Props {
  media: Media
  action?: React.ReactNode
}

export default function MediaCard({ media, action }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">
          <Link to={`/media/${media.id}`} className="hover:text-purple-700">
            {media.title}
          </Link>
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGES[media.media_type]}`}
        >
          {media.media_type}
        </span>
      </div>
      <p className="text-sm text-gray-500">{media.year}</p>
      <p className="text-sm text-gray-600 line-clamp-2">{media.description}</p>
      <div className="flex flex-wrap gap-1 mt-auto">
        {media.genres.map((g) => (
          <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {g}
          </span>
        ))}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}