import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import { VgButton } from '../components/ui/VgButton';
import { VgCard, VgCardContent } from '../components/ui/VgCard';
import { VgBadge } from '../components/ui/VgBadge';
import { Icon, type IconName } from '../components/ui/Icon';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const features: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'book',
    title: 'Unified Library',
    description:
      'Track anime, movies & games in one place with status lists: Watching, Completed, Dropped, or Planned.',
  },
  {
    icon: 'chart',
    title: 'Beautiful Analytics',
    description:
      'See your completion rate, favorite genres, and media type breakdown with painterly progress bars and rings.',
  },
  {
    icon: 'sparkles',
    title: 'Smart Recommendations',
    description:
      'Get personalized picks based on what you watch, with "why" reasons like "matches your taste for fantasy".',
  },
];

const hotspots: { icon: IconName; count: string; label: string }[] = [
  { icon: 'eye', count: 'Watch', label: 'Log anime, movies & games' },
  { icon: 'target', count: 'Track', label: 'Progress, notes & status lists' },
  { icon: 'compass', count: 'Discover', label: 'Recommendations just for you' },
];

const stats = [
  { value: '3', label: 'Media types' },
  { value: '4', label: 'Watch statuses' },
  { value: '∞', label: 'Possibilities' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const go = (path: string) => () => navigate(user ? path : '/login');

  return (
    <PageWrapper>
      <div className="relative overflow-hidden">
        {/* Hero */}
        <section className="relative px-4 lg:px-8 pt-28 lg:pt-40 pb-16 lg:pb-24">
          <motion.div
            className="pointer-events-none absolute top-10 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-sunflower/10 via-orange-500/10 to-transparent blur-3xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald/10 via-ultramarine/20 to-transparent blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />

          <motion.div
            className="hidden lg:block absolute top-28 left-[6%] text-sunflower/25"
            animate={{ y: [-6, 6, -6], rotate: [-6, 6, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Icon icon="brush" size={64} />
          </motion.div>
          <motion.div
            className="hidden lg:block absolute bottom-28 right-[8%] text-emerald/30"
            animate={{ y: [6, -6, 6], rotate: [6, -6, 6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Icon icon="palette" size={52} />
          </motion.div>

          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VgBadge variant="genre" size="md">
                <Icon icon="brush" size={14} />
                A Living Painting
              </VgBadge>
            </motion.div>

            <motion.h1
              className="font-display text-5xl lg:text-7xl font-bold text-canvas leading-tight tracking-tight mb-6"
              initial={{ opacity: 0, y: 40, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="text-sunflower">Track</span> what you watch,
              <br className="hidden lg:block" />{' '}
              <span className="bg-gradient-to-r from-emerald via-turquoise to-sunflower bg-clip-text text-transparent">
                painted beautifully
              </span>
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Your personal hub for anime, movies & games. Log what you're watching, build your library,
              get recommendations, and see your stats — all in a Van Gogh-inspired world.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <VgButton size="lg" onClick={go('/dashboard')} rightIcon={<Icon icon="arrow-right" size={18} />}>
                {user ? 'Open Dashboard' : 'Get Started'}
              </VgButton>
              <VgButton size="lg" variant="secondary" onClick={() => navigate('/search')}>
                Explore Media
              </VgButton>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-3xl lg:text-4xl font-bold text-sunflower">{s.value}</p>
                  <p className="text-text-secondary text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Hotspot strip */}
        <section className="px-4 lg:px-8 pb-14">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hotspots.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <VgCard variant="elevated" className="text-center p-6">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower mb-4"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    <Icon icon={h.icon} size={26} />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-sunflower">{h.count}</h3>
                  <p className="text-text-secondary mt-1">{h.label}</p>
                </VgCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 lg:px-8 pb-14">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-canvas mb-3">
                Why Choose MediaTracker?
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Everything you need to keep your media world in order, without losing the art.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                >
                  <VgCard variant="default" className="h-full">
                    <VgCardContent className="p-6">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                      >
                        <Icon icon={f.icon} size={24} />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-canvas mb-2">{f.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{f.description}</p>
                    </VgCardContent>
                  </VgCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-4 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <VgCard variant="framed" className="max-w-4xl mx-auto text-center">
              <VgCardContent className="p-10 lg:p-14">
                <motion.div
                  className="inline-flex mb-5"
                  animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Logo size={72} />
                </motion.div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-canvas mb-4">
                  Ready to organize your media world?
                </h2>
                <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join the canvas — create your library, track your progress, and paint your own media journey.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <VgButton size="lg" onClick={go('/register')} rightIcon={<Icon icon="arrow-right" size={18} />}>
                    {user ? 'Go to Dashboard' : 'Start Free'}
                  </VgButton>
                  <VgButton size="lg" variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </VgButton>
                </div>
              </VgCardContent>
            </VgCard>
          </motion.div>
        </section>
      </div>
    </PageWrapper>
  );
}