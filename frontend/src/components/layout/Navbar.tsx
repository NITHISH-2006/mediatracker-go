import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import { Icon, type IconName } from '../ui/Icon';

const navItems: { path: string; label: string; icon: IconName }[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'chart' },
  { path: '/library', label: 'Library', icon: 'book' },
  { path: '/search', label: 'Search', icon: 'search' },
  { path: '/add-media', label: 'Add Media', icon: 'plus' },
  { path: '/recommendations', label: 'Recommendations', icon: 'sparkles' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
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
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 font-display text-2xl lg:text-3xl font-bold text-sunflower hover:opacity-80 transition-opacity"
            aria-label="MediaTracker Home"
          >
            <Logo size={38} className="drop-shadow-[0_0_12px_rgba(244,211,94,0.35)]" />
            MediaTracker
          </Link>

          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-1 bg-night/50 rounded-2xl p-1 border border-border-subtle/50">
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
                      <Icon icon={item.icon} size={17} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-3 ml-3">
                  <motion.div
                    className="flex items-center gap-3 px-4 py-2 bg-night/50 rounded-xl border border-border-subtle/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep flex items-center justify-center text-night font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="font-body font-semibold text-canvas text-sm">{user.username}</p>
                      <p className="text-xs text-text-muted truncate max-w-[140px]">{user.email}</p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-semibold text-vermilion border border-vermilion/40 hover:bg-vermilion/10 transition-colors"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    title="Log out"
                  >
                    <Icon icon="log-out" size={16} />
                    <span className="hidden xl:inline">Logout</span>
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <NavLink
                  to="/dashboard"
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-night/50 text-text-secondary hover:text-sunflower border border-border-subtle/50 transition-all duration-300"
                  aria-label="Dashboard"
                >
                  <Icon icon="chart" size={20} />
                </NavLink>
                <motion.button
                  onClick={() => setOpen((v) => !v)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-night/50 text-canvas border border-border-subtle/50 transition-all duration-300"
                  aria-label="Toggle menu"
                  aria-expanded={open}
                >
                  <Icon icon={open ? 'close' : 'menu'} size={20} />
                </motion.button>
              </div>
            </>
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
        </div>
      </div>

      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden overflow-hidden border-t border-border-subtle/50 bg-night/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl font-body font-medium text-sm transition-all
                    ${isActive
                      ? 'bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower border border-sunflower/30'
                      : 'text-text-secondary hover:text-sunflower hover:bg-night/50 border border-transparent'}
                  `}
                >
                  <Icon icon={item.icon} size={18} />
                  {item.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-subtle/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep flex items-center justify-center text-night font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="font-body font-semibold text-canvas text-sm">{user.username}</p>
                    <p className="text-xs text-text-muted truncate max-w-[160px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-semibold text-vermilion border border-vermilion/40 hover:bg-vermilion/10 transition-colors"
                >
                  <Icon icon="log-out" size={16} />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}