import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VgCard, VgCardHeader, VgCardContent, VgCardFooter } from '../components/ui/VgCard';
import { VgInput } from '../components/ui/VgInput';
import PageWrapper from '../components/layout/PageWrapper';
import { FadeInUp, ScaleIn, FloatingElement } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Login failed');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper showNavbar={false}>
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-sunflower/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-bl from-orange-500/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 2 }}
        aria-hidden="true"
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <FadeInUp delay={0.1}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-3xl text-night">🎨</span>
              </motion.div>
              <h1 className="text-display text-3xl font-bold text-canvas mb-2">
                Welcome Back
              </h1>
              <p className="text-text-secondary">
                Sign in to continue your media journey
              </p>
            </motion.div>

            <ScaleIn delay={0.2}>
              <VgCard variant="framed">
                <VgCardHeader className="p-6 pb-3">
                  <h2 className="font-display text-2xl font-bold text-canvas">Sign In</h2>
                  <p className="text-text-secondary mt-1">Enter your credentials to access your library</p>
                </VgCardHeader>
                <VgCardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate id="login-form">
                    {error && (
                      <motion.div
                        className="bg-vermilion/20 border border-vermilion/30 rounded-xl p-4 flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-full bg-vermilion/20 flex items-center justify-center flex-shrink-0"
                          animate={{ scale: [1, 1.1, 1] }}
                        >
                          <svg className="w-5 h-5 text-vermilion" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </motion.div>
                        <p className="text-vermilion text-sm flex-1">{error}</p>
                        <motion.button
                          onClick={() => setError('')}
                          className="text-vermilion hover:text-red-400"
                          whileHover={{ scale: 1.1 }}
                        >
                          ✕
                        </motion.button>
                      </motion.div>
                    )}

                    <VgInput
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      }
                    />

                    <VgInput
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      }
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border-subtle text-sunflower focus:ring-sunflower" />
                        <span className="text-text-secondary text-sm">Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-sunflower hover:underline font-medium">
                        Forgot password?
                      </Link>
                    </div>
                  </form>
                </VgCardContent>
                <VgCardFooter className="p-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="submit"
                    form="login-form"
                    disabled={loading}
                    className="vg-btn vg-btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </motion.span>
                        Signing in…
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </VgCardFooter>
              </VgCard>
            </ScaleIn>

            {/* Divider */}
            <motion.div
              className="vg-divider my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              or continue with
            </motion.div>

            {/* Social login buttons */}
            <FadeInUp delay={0.3}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Google', icon: '🌐', color: 'secondary' },
                  { label: 'GitHub', icon: '💻', color: 'secondary' },
                ].map((provider) => (
                  <motion.button
                    key={provider.label}
                    type="button"
                    className="vg-btn vg-btn-secondary flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <span>{provider.icon}</span>
                    <span>{provider.label}</span>
                  </motion.button>
                ))}
              </div>
            </FadeInUp>

            {/* Register link */}
            <FadeInUp delay={0.4}>
              <motion.p
                className="text-center text-text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Don't have an account?{' '}
                <Link to="/register" className="text-sunflower font-medium hover:underline">
                  Create one
                </Link>
              </motion.p>
            </FadeInUp>

            {/* Decorative floating elements */}
            <FloatingElement intensity={0.5} className="absolute -top-10 -right-10 w-24 h-24 opacity-20" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 75 L25 90 L35 60 L10 40 L40 40 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </FloatingElement>
            <FloatingElement intensity={0.3} className="absolute -bottom-10 -left-10 w-16 h-16 opacity-15" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </FloatingElement>
          </motion.div>
        </FadeInUp>
      </div>
    </PageWrapper>
  );
}