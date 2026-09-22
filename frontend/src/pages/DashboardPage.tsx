import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { VgCard, VgCardContent } from '@/components/ui/VgCard';
import { VgButton } from '@/components/ui/VgButton';
import { VgGenreBar, VgProgressRing } from '@/components/ui/VgBadge';
import PageWrapper, { PageHeader, SectionCard } from '@/components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp, ScaleIn } from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import type { DashboardResponse } from '../types';

const genreColors = [
  'bg-sunflower',
  'bg-orange-500',
  'bg-emerald',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-400',
  'bg-purple-500',
  'bg-red-500',
];

const statCards = [
  { label: 'Watching', key: 'total_watching', color: 'blue', icon: '👁️' },
  { label: 'Completed', key: 'total_completed', color: 'emerald', icon: '✅' },
  { label: 'Planned', key: 'total_planned', color: 'purple', icon: '📋' },
  { label: 'Dropped', key: 'total_dropped', color: 'red', icon: '🗑️' },
];

const typeIcons = {
  anime: '📺',
  movie: '🎬',
  game: '🎮',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <PageHeader title="Dashboard" subtitle="Loading your media journey..." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <VgCard key={stat.key} className="animate-pulse" variant="elevated">
                <VgCardContent className="text-center">
                  <div className="h-16 w-full bg-canvas/80 rounded-xl" />
                </VgCardContent>
              </VgCard>
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !data) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <PageHeader title="Dashboard" subtitle="Failed to load dashboard" />
          <VgCard variant="elevated" className="max-w-xl mx-auto">
            <VgCardContent className="text-center py-8">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
              >
                🎨
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">{error}</p>
              <VgButton onClick={() => window.location.reload()} className="vg-btn vg-btn-primary">
                Retry
              </VgButton>
            </VgCardContent>
          </VgCard>
        </div>
      </PageWrapper>
    );
  }

  const genres = Object.entries(data.favorite_genres).sort((a, b) => b[1] - a[1]);
  const maxGenre = genres[0]?.[1] ?? 1;
  const totalItems = data.total_items ?? 
    data.total_completed + data.total_watching + data.total_planned + data.total_dropped;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <PageHeader
          title="Dashboard"
          subtitle="Your media journey at a glance"
        />

        {/* Stats Grid */}
        <FadeInUp delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            {statCards.map((stat, index) => (
              <ScaleIn key={stat.key} delay={index * 0.08}>
                <VgCard variant="elevated" className="overflow-hidden" float>
                  <VgCardContent className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-display text-xl font-bold text-canvas">
                        {stat.icon}
                      </span>
                    </div>
                    <motion.div
                      className="text-display text-5xl font-bold text-canvas"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {data[stat.key as keyof DashboardResponse] as number}
                    </motion.div>
                    <p className="text-text-secondary text-sm mt-1 font-medium">{stat.label}</p>
                  </VgCardContent>
                </VgCard>
              </ScaleIn>
            ))}
          </div>
        </FadeInUp>

        {/* Media Profile + Completion Rate */}
        <StaggerContainer delay={0.1} className="mb-8 lg:mb-12">
          <StaggerItem>
            <SectionCard
              title="Media Profile"
              subtitle="Your media type breakdown"
              icon={<span className="text-2xl">📊</span>}
              className="overflow-visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(data.media_profile || {}).map(([type, count], i) => (
                  <motion.div
                    key={type}
                    className="group relative bg-canvas/80 rounded-3xl border border-border-subtle/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20 hover:shadow-lg shadow-sunflower/20"
                    whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-card-hover)' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl text-canvas">{typeIcons[type as keyof typeof typeIcons] || '📦'}</span>
                    </div>
                    <motion.div
                      className="text-display text-5xl font-bold text-canvas"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.1 + 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {count}
                    </motion.div>
                    <p className="text-text-secondary text-sm font-medium capitalize mt-1">{type}</p>
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>

          <StaggerItem>
            <SectionCard
              title="Completion Rate"
              subtitle={`${Math.round(data.completion_rate || 0)}% of your library completed`}
              icon={<span className="text-2xl">🎯</span>}
              className="overflow-visible"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-1 flex justify-center">
                  <VgProgressRing
                    percentage={Math.round(data.completion_rate || 0)}
                    size={160}
                    strokeWidth={8}
                    color="sunflower"
                    showPercentage={true}
                  />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-canvas/80 rounded-3xl border border-border-subtle/50 p-6 backdrop-blur-sm">
                    <h3 className="font-body font-medium text-canvas text-lg mb-4">Progress Overview</h3>
                    <div className="space-y-4">
                      {statCards.map((stat) => (
                        <div key={stat.key} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">{stat.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-secondary">{stat.label}</span>
                              <span className="font-semibold text-canvas">{data[stat.key as keyof DashboardResponse] as number}</span>
                            </div>
                            <VgGenreBar
                              percentage={totalItems > 0 ? ((data[stat.key as keyof DashboardResponse] as number) / totalItems) * 100 : 0}
                              color={stat.color as 'sunflower' | 'orange' | 'emerald' | 'blue' | 'purple'}
                              height={8}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-canvas/80 rounded-3xl border border-border-subtle/50">
                    <VgProgressRing
                      percentage={Math.round(data.completion_rate || 0)}
                      size={80}
                      strokeWidth={6}
                      color="sunflower"
                      showPercentage={true}
                    />
                    <div>
                      <p className="font-body font-medium text-canvas text-lg">Overall Completion</p>
                      <p className="text-text-secondary text-sm">
                        {data.total_completed} of {totalItems} items completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Favorite Genres */}
        <FadeInUp delay={0.2}>
          <SectionCard
            title="Favorite Genres"
            subtitle="What you love to watch"
            icon={<span className="text-2xl">🎭</span>}
            className="overflow-visible"
          >
            {genres.length === 0 ? (
              <motion.div
                className="text-center py-12 bg-canvas/80 rounded-3xl border border-border-subtle/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -3, 3, 0] }}
                >
                  🎨
                </motion.div>
                <p className="text-text-secondary text-lg mb-4">
                  No genres yet. Add media to your library to see genre stats.
                </p>
                <VgButton className="vg-btn vg-btn-primary" onClick={() => (window.location.href = '/search')}>
                  Explore Media
                </VgButton>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {genres.map(([genre, count], i) => (
                  <motion.div
                    key={genre}
                    className="group relative bg-canvas/80 rounded-2xl border border-border-subtle/50 p-4 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20 hover:shadow-lg shadow-sunflower/20"
                    whileHover={{ scale: 1.01, x: 4, boxShadow: 'var(--shadow-card-hover)' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${genreColors[i % genreColors.length]}, ${genreColors[(i + 1) % genreColors.length]})` }}
                          whileHover={{ scale: 1.15 }}
                        >
                          <span className="text-xs font-bold text-night">{count}</span>
                        </motion.div>
                        <span className="font-body font-medium text-canvas capitalize">{genre}</span>
                      </div>
                      <span className="font-bold text-sunflower text-lg">{count}</span>
                    </div>
                    <VgGenreBar
                      percentage={(count / maxGenre) * 100}
                      color={genreColors[i % genreColors.length].replace('bg-', '') as 'sunflower' | 'orange' | 'emerald' | 'blue' | 'purple'}
                      height={6}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </SectionCard>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.3}>
          <SectionCard
            title="Quick Actions"
            subtitle="Continue your journey"
            icon={<span className="text-2xl">✨</span>}
            className="overflow-visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { path: '/search', label: 'Discover Media', icon: '🔍', desc: 'Find new anime, movies & games' },
                { path: '/add-media', label: 'Add Media', icon: '➕', desc: 'Add to the catalog' },
                { path: '/library', label: 'My Library', icon: '📚', desc: 'Manage your collection' },
                { path: '/recommendations', label: 'Get Recommendations', icon: '🔮', desc: 'Personalized picks for you' },
              ].map((action, i) => (
                <motion.button
                  key={action.path}
                  onClick={() => window.location.href = action.path}
                  className="group relative bg-canvas/80 rounded-2xl border border-border-subtle/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20 hover:shadow-lg shadow-sunflower/20 flex flex-col items-start text-left"
                  whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-card-hover)' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="font-body font-bold text-canvas text-lg mb-1">{action.label}</h3>
                  <p className="text-text-secondary text-sm mb-4">{action.desc}</p>
                  <motion.span
                    className="inline-flex items-center gap-1 text-sunflower font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    Explore
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </SectionCard>
        </FadeInUp>
      </div>
    </PageWrapper>
  );
}