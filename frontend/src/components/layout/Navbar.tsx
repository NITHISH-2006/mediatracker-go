import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🎨' },
  { path: '/library', label: 'Library', icon: '📚' },
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/add-media', label: 'Add Media', icon: '✨' },
  { path: '/recommendations', label: 'Recommendations', icon: '🔮' },
] as const;

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-night/95 backdrop-blur-xl border-b border-border-subtle/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link
            to="/"
            className="flex items-center gap-3 text-display text-2xl lg:text-3xl font-bold text-sunflower hover:opacity-80 transition-opacity"
            aria-label="MediaTracker Home"
          >
            <motion.span
              animate={{ rotate: [0, -5, 5, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              🎨
            </motion.span>
            MediaTracker
          </Link>

          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 lg:gap-3"
              >
                <div className="hidden lg:flex items-center gap-1 bg-night/50 rounded-2xl p-1 border border-border-subtle/50">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 px-4 py-2 rounded-xl
                        font-body font-medium text-sm
                        transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep text-night shadow-lg shadow-sunflower/30'
                          : 'text-text-secondary hover:text-sunflower hover:bg-night/50'}
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-3 lg:hidden">
                  <NavLink
                    to="/dashboard"
                    className="w-11 h-11 rounded-xl flex items-center justify-center bg-night/50 text-text-secondary hover:text-sunflower hover:bg-sunflower/10 border border-border-subtle/50 transition-all duration-300"
                    aria-label="Dashboard"
                  >
                    🎨
                  </NavLink>
                </div>

                <div className="hidden lg:flex items-center gap-3">
                  <motion.div
                    className="flex items-center gap-3 px-4 py-2 bg-night/50 rounded-xl border border-border-subtle/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep flex items-center justify-center text-night font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="font-body font-semibold text-canvas text-sm">{user.username}</p>
                      <p className="text-xs text-text-muted truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    className="vg-btn vg-btn-secondary px-5 py-2.5 text-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl font-body font-medium text-text-secondary hover:text-sunflower hover:bg-night/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="vg-btn vg-btn-primary px-5 py-2.5"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}