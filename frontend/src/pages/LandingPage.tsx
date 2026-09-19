import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '📚', title: 'Track Everything', desc: 'Anime, movies & games in one place' },
  { icon: '✅', title: 'Smart Lists', desc: 'Watching, Completed, Dropped or Planned' },
  { icon: '📊', title: 'Dashboard Stats', desc: 'See your progress and favorite genres' },
  { icon: '✨', title: 'Recommendations', desc: 'Personalized picks based on your taste' },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-purple-50 to-white">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
        Track your <span className="text-purple-600">media journey</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-xl">
        Your personal hub for anime, movies & games. Log what you're watching, build your
        library, get recommendations, and see your stats.
      </p>
      <div className="mt-8 flex gap-3">
        {user ? (
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Login
            </Link>
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 text-left shadow-sm">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mt-3">{f.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}