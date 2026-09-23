import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { VgCard, VgCardHeader, VgCardContent } from '../components/ui/VgCard';
import { VgInput } from '../components/ui/VgInput';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import PageWrapper from '../components/layout/PageWrapper';
import { FadeInUp, FloatingElement } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const { register } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      success(`Welcome, ${username}!`);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error || 'Registration failed'
          : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <FadeInUp delay={0.1}>
          <motion.div
            className="w-full max-w-md relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div className="text-center mb-8">
              <motion.div
                className="inline-flex mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Logo size={84} />
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-canvas mb-2">
                Create Your Account
              </h1>
              <p className="text-text-secondary">
                Start tracking your media journey today
              </p>
            </motion.div>

            <VgCard variant="framed">
              <VgCardHeader className="p-6 pb-3">
                <h2 className="font-display text-2xl font-bold text-canvas">Join MediaTracker</h2>
                <p className="text-text-secondary mt-1">Fill in your details to get started</p>
              </VgCardHeader>
              <VgCardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {error && (
                    <motion.div
                      className="bg-vermilion/20 border border-vermilion/30 rounded-xl p-3.5 flex items-center gap-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-vermilion flex-shrink-0">
                        <Icon icon="x-circle" size={20} />
                      </span>
                      <p className="text-vermilion text-sm flex-1">{error}</p>
                      <button
                        type="button"
                        onClick={() => setError('')}
                        className="text-vermilion hover:text-red-400"
                        aria-label="Dismiss error"
                      >
                        <Icon icon="close" size={16} />
                      </button>
                    </motion.div>
                  )}

                  <VgInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="anime_fan"
                    required
                    autoComplete="username"
                    minLength={3}
                    maxLength={20}
                    leftIcon={<Icon icon="user" size={18} />}
                  />

                  <VgInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    leftIcon={<Icon icon="mail" size={18} />}
                  />

                  <VgInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    helperText="At least 8 characters"
                    leftIcon={<Icon icon="lock" size={18} />}
                  />

                  <VgInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                    leftIcon={<Icon icon="lock" size={18} />}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="vg-btn vg-btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-flex"
                        >
                          <Icon icon="refresh" size={18} />
                        </motion.span>
                        Creating account…
                      </>
                    ) : (
                      <>
                        <Icon icon="check-circle" size={18} />
                        Create Account
                      </>
                    )}
                  </button>
                </form>
              </VgCardContent>
            </VgCard>

            <FadeInUp delay={0.3}>
              <motion.p className="text-center mt-8 text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-sunflower font-medium hover:underline">
                  Sign in
                </Link>
              </motion.p>
            </FadeInUp>

            <FloatingElement intensity={0.5} className="absolute -top-6 -right-8 w-20 h-20 opacity-25 text-sunflower" aria-hidden="true">
              <Icon icon="brush" size={80} />
            </FloatingElement>
            <FloatingElement intensity={0.4} className="absolute -bottom-8 -left-8 w-14 h-14 opacity-20 text-sunflower" aria-hidden="true">
              <Icon icon="star" size={56} />
            </FloatingElement>
          </motion.div>
        </FadeInUp>
      </div>
    </PageWrapper>
  );
}