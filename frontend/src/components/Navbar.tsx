import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-purple-700">
          🎬 MediaTracker
        </Link>

        {user ? (
          <>
            <div className="flex items-center gap-1">
              <NavLink to="/dashboard" className={navLink}>
                Dashboard
              </NavLink>
              <NavLink to="/library" className={navLink}>
                Library
              </NavLink>
              <NavLink to="/search" className={navLink}>
                Search
              </NavLink>
              <NavLink to="/add-media" className={navLink}>
                Add Media
              </NavLink>
              <NavLink to="/recommendations" className={navLink}>
                Recs
              </NavLink>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">👤 {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}