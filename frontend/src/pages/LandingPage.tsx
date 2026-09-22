import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { VgButton } from '@/components/ui/VgButton';
import { VgCard, VgCardContent } from '@/components/ui/VgCard';
import { VgBadge } from '@/components/ui/VgBadge';
import { FadeInUp, StaggerContainer, StaggerItem, FloatingElement } from '@/components/animations/PageTransition';

const features = [
  {
    icon: '🎨',
    title: 'Unified Library',
    description:
      'Track anime, movies & games in one place with painterly status lists: Watching, Completed, Dropped, or Planned.',
  },
  {
    icon: '📊',
    title: 'Beautiful Analytics',
    description:
      'See your completion rate, favorite genres, and media type breakdown with artistic progress bars and rings.',
  },
  {
    icon: '🔮',
    title: 'Smart Recommendations',
    description:
      'Get personalized picks based on what you watch, with "why" reasons like "matches your taste for fantasy".',
  },
];

const hotspots = [
  { icon: '👁️', count: 'Watch', label: 'Log anime, movies & games' },
  { icon: '📚', count: 'Track', label: 'Progress, notes & status lists' },
  { icon: '✨', count: 'Discover', label: 'Recommendations just for you' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="relative overflow-hidden">
        {/* Hero */}
        <section className="relative px-4 lg:px-8 pt-28 lg:pt-36 pb-16 lg:pb-24">
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

          <FloatingElement intensity={0.6} className="absolute top-24 left-[6%] w-16 h-16 text-sunflower/20">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 75 L25 90 L35 60 L10 40 L40 40 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </FloatingElement>
          <FloatingElement intensity={0.4} className="absolute bottom-24 right-[8%] w-12 h-12 text-lavender/20">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </FloatingElement>

          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VgBadge variant="genre" size="md">🖌️ A Living Painting</VgBadge>
            </motion.div>

            <motion.h1
              className="text-display text-5xl lg:text-7xl font-bold text-canvas leading-tight tracking-tight mb-6"
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
              <VgButton size="lg" onClick={() => navigate('/register')}>
                Get Started
              </VgButton>
              <VgButton size="lg" variant="secondary" onClick={() => navigate('/search')}>
                Explore Media
              </VgButton>
            </motion.div>
          </div>
        </section>

        {/* Hotspot strip */}
        <FadeInUp delay={0.2}>
          <section className="px-4 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hotspots.map((h) => (
                <VgCard key={h.label} variant="elevated" className="text-center p-6">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 mb-4"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    <span className="text-2xl">{h.icon}</span>
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-sunflower">{h.count}</h3>
                  <p className="text-text-secondary mt-1">{h.label}</p>
                </VgCard>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* Features */}
        <StaggerContainer delay={0.1} className="px-4 lg:px-8 pb-12">
          <section className="max-w-6xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-10">
                <h2 className="text-display text-3xl lg:text-4xl font-bold text-canvas mb-3">
                  Why Choose MediaTracker?
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  Everything you need to keep your media world in order, without losing the art.
                </p>
              </div>
            </FadeInUp>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <VgCard variant="default" hover className="h-full">
                    <VgCardContent className="p-6">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                      >
                        <span className="text-2xl">{f.icon}</span>
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-canvas mb-2">{f.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{f.description}</p>
                    </VgCardContent>
                  </VgCard>
                </StaggerItem>
              ))}
            </div>
          </section>
        </StaggerContainer>

        {/* Call to action */}
        <FadeInUp delay={0.15}>
          <section className="px-4 lg:px-8 pb-20">
            <VgCard variant="framed" className="max-w-4xl mx-auto text-center">
              <VgCardContent className="p-10 lg:p-14">
                <motion.div
                  className="text-6xl mb-5"
                  animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🎨
                </motion.div>
                <h2 className="text-display text-3xl lg:text-4xl font-bold text-canvas mb-4">
                  Ready to organize your media world?
                </h2>
                <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join the canvas — create your library, track your progress, and paint your own media journey.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <VgButton size="lg" onClick={() => navigate('/register')}>
                  Start Free
                </VgButton>
                <VgButton size="lg" variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </VgButton>
                </div>
              </VgCardContent>
            </VgCard>
          </section>
        </FadeInUp>
      </div>
    </PageWrapper>
  );
}