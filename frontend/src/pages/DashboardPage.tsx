import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { VgCard, VgCardContent } from '../components/ui/VgCard';
import { VgGenreBar, VgProgressRing } from '../components/ui/VgBadge';
import { Icon, type IconName } from '../components/ui/Icon';
import PageWrapper, { PageHeader, SectionCard } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp, ScaleIn } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import type { DashboardResponse, LibraryItem, Media } from '../types';

const genreColors = ['sunflower', 'orange', 'emerald', 'blue', 'purple'];


const statCards: { label: string; key: keyof DashboardResponse; color: 'sunflower' | 'orange' | 'emerald' | 'blue' | 'purple'; icon: IconName; iconColor: string }[] = [
  { label: 'Watching', key: 'total_watching', color: 'sunflower', icon: 'eye', iconColor: 'text-sunflower' },
  { label: 'Completed', key: 'total_completed', color: 'emerald', icon: 'check-circle', iconColor: 'text-emerald-400' },
  { label: 'Planned', key: 'total_planned', color: 'purple', icon: 'clock', iconColor: 'text-lavender-light' },
  { label: 'Dropped', key: 'total_dropped', color: 'orange', icon: 'x-circle', iconColor: 'text-vermilion' },
];

const typeIcons: Record<string, IconName> = {
  anime: 'book',
  movie: 'film',
  game: 'gamepad',
};

const quickActions: { path: string; label: string; icon: IconName; desc: string }[] = [
  { path: '/search', label: 'Discover Media', icon: 'search', desc: 'Find new anime, movies & games' },
  { path: '/add-media', label: 'Add Media', icon: 'plus', desc: 'Add to the catalog' },
  { path: '/library', label: 'My Library', icon: 'book', desc: 'Manage your collection' },
  { path: '/recommendations', label: 'Get Recommendations', icon: 'sparkles', desc: 'Personalized picks for you' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getLibrary(), api.getMedia()])
      .then(([dash, lib, media]) => {
        setData(dash);
        setLibrary(lib);
        const map: Record<string, Media> = {};
        media.forEach((m) => (map[m.id] = m));
        setMediaMap(map);
      })
      .catch(() => {
        setError('Failed to load dashboard');
        toastError('Could not load your dashboard');
      })
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
          <PageHeader title="Dashboard" subtitle="Something went wrong" />
          <VgCard variant="elevated" className="max-w-xl mx-auto">
            <VgCardContent className="text-center py-8">
              <motion.div className="text-vermilion/70 mb-4 inline-flex" animate={{ rotate: [0, -5, 5, 0] }}>
                <Icon icon="chart" size={56} />
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="vg-btn vg-btn-primary inline-flex items-center gap-2"
              >
                <Icon icon="refresh" size={18} />
                Retry
              </button>
            </VgCardContent>
          </VgCard>
        </div>
      </PageWrapper>
    );
  }

  const genres = Object.entries(data.favorite_genres).sort((a, b) => b[1] - a[1]);
  const maxGenre = genres[0]?.[1] ?? 1;
  const totalItems =
    data.total_items ?? data.total_completed + data.total_watching + data.total_planned + data.total_dropped;

  const recent = [...library]
    .sort((a, b) => (b.added_at || '').localeCompare(a.added_at || ''))
    .slice(0, 5);
  const upNext = library
    .filter((i) => i.status === 'Watching')
    .sort((a, b) => b.progress - a.progress)[0];

  const firstName = user?.username?.split(/[\s_-]/)[0] || 'there';

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <PageHeader
          title={`Hello, ${firstName}`}
          subtitle="Your media journey at a glance"
        />

        {/* Stats Grid */}
        <FadeInUp delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            {statCards.map((stat, index) => (
              <ScaleIn key={stat.key} delay={index * 0.08}>
                <VgCard variant="elevated" className="overflow-hidden">
                  <VgCardContent className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex p-2 rounded-xl bg-sunflower/10 ${stat.iconColor}`}>
                        <Icon icon={stat.icon} size={22} />
                      </span>
                    </div>
                    <motion.div
                      className="font-display text-5xl font-bold text-canvas"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {data[stat.key] as number}
                    </motion.div>
                    <p className="text-text-secondary text-sm mt-1 font-medium">{stat.label}</p>
                  </VgCardContent>
                </VgCard>
              </ScaleIn>
            ))}
          </div>
        </FadeInUp>

        {/* Up Next */}
        {upNext && (
          <FadeInUp delay={0.15}>
            <VgCard variant="framed" className="mb-8 lg:mb-12">
              <VgCardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunflower/25 to-orange-500/25 text-sunflower flex items-center justify-center flex-shrink-0">
                    <Icon icon="play" size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Continue watching</p>
                    <h3 className="font-display text-xl lg:text-2xl font-bold text-canvas truncate">
                      {mediaMap[upNext.media_id]?.title ?? 'Unknown title'}
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Progress: {upNext.progress} · {mediaMap[upNext.media_id]?.media_type}
                    </p>
                  </div>
                  <VgGenreBar
                    percentage={Math.min(100, upNext.progress)}
                    color="sunflower"
                    height={8}
                  />
                  <button
                    onClick={() => navigate('/library')}
                    className="vg-btn vg-btn-secondary flex items-center gap-2 flex-shrink-0"
                  >
                    Continue
                    <Icon icon="arrow-right" size={16} />
                  </button>
                </div>
              </VgCardContent>
            </VgCard>
          </FadeInUp>
        )}

        {/* Media Profile + Completion Rate */}
        <StaggerContainer delay={0.1} className="mb-8 lg:mb-12">
          <StaggerItem>
            <SectionCard
              title="Media Profile"
              subtitle="Your media type breakdown"
              icon={<Icon icon="chart" size={24} />}
              className="overflow-visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(data.media_profile || {}).map(([type, count], i) => (
                  <motion.div
                    key={type}
                    className="group relative bg-canvas/80 rounded-3xl border border-border-subtle/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20"
                    whileHover={{ scale: 1.02, y: -4 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower">
                        <Icon icon={typeIcons[type] ?? 'archive'} size={24} />
                      </span>
                    </div>
                    <motion.div
                      className="font-display text-5xl font-bold text-canvas"
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
              icon={<Icon icon="target" size={24} />}
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
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-sunflower/10 ${stat.iconColor}`}>
                            <Icon icon={stat.icon} size={22} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-secondary">{stat.label}</span>
                              <span className="font-semibold text-canvas">{data[stat.key] as number}</span>
                            </div>
                            <VgGenreBar
                              percentage={totalItems > 0 ? ((data[stat.key] as number) / totalItems) * 100 : 0}
                              color={stat.color}
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
            icon={<Icon icon="layers" size={24} />}
            className="overflow-visible"
          >
            {genres.length === 0 ? (
              <motion.div
                className="text-center py-12 bg-canvas/80 rounded-3xl border border-border-subtle/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div className="text-sunflower/50 mb-4 inline-flex" animate={{ rotate: [0, -3, 3, 0] }}>
                  <Icon icon="palette" size={56} />
                </motion.div>
                <p className="text-text-secondary text-lg mb-4">
                  No genres yet. Add media to your library to see genre stats.
                </p>
                <button onClick={() => navigate('/search')} className="vg-btn vg-btn-primary inline-flex items-center gap-2">
                  <Icon icon="search" size={18} />
                  Explore Media
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {genres.map(([genre, count], i) => (
                  <motion.div
                    key={genre}
                    className="group relative bg-canvas/80 rounded-2xl border border-border-subtle/50 p-4 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20"
                    whileHover={{ scale: 1.01, x: 4 }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${genreColors[i % genreColors.length]}`}
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

        {/* Recently Added */}
        <FadeInUp delay={0.25}>
          <SectionCard
            title="Recently Added"
            subtitle="The latest additions to your library"
            icon={<Icon icon="refresh" size={24} />}
            className="overflow-visible"
            action={
              <button
                onClick={() => navigate('/library')}
                className="text-sm text-sunflower hover:underline font-medium flex items-center gap-1"
              >
                View all
                <Icon icon="arrow-right" size={15} />
              </button>
            }
          >
            {recent.length === 0 ? (
              <p className="text-text-secondary text-center py-8">
                Your library is empty — find something to add.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {recent.map((item, i) => {
                  const media = mediaMap[item.media_id];
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => navigate('/library')}
                      className="group relative bg-canvas/80 rounded-2xl border border-border-subtle/50 p-4 backdrop-blur-sm text-left transition-all duration-500 hover:border-sunflower/30"
                      whileHover={{ scale: 1.03, y: -4 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-sunflower/10 ${
                        media?.media_type === 'movie' ? 'text-indigo-400' :
                        media?.media_type === 'game' ? 'text-teal-400' : 'text-pink-400'
                      }`}>
                        <Icon icon={typeIcons[media?.media_type ?? ''] ?? 'archive'} size={22} />
                      </div>
                      <p className="font-body font-semibold text-canvas text-sm line-clamp-1">{media?.title ?? 'Unknown'}</p>
                      <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                        <Icon icon="clock" size={12} />
                        {item.added_at ? new Date(item.added_at).toLocaleDateString() : 'Recently added'}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.3}>
          <SectionCard
            title="Quick Actions"
            subtitle="Continue your journey"
            icon={<Icon icon="compass" size={24} />}
            className="overflow-visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="group relative bg-canvas/80 rounded-2xl border border-border-subtle/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-sunflower/20 hover:shadow-lg shadow-sunflower/20 flex flex-col items-start text-left"
                  whileHover={{ scale: 1.02, y: -4 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon icon={action.icon} size={24} />
                  </div>
                  <h3 className="font-body font-bold text-canvas text-lg mb-1">{action.label}</h3>
                  <p className="text-text-secondary text-sm mb-4">{action.desc}</p>
                  <motion.span className="inline-flex items-center gap-1.5 text-sunflower font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Explore
                    <Icon icon="arrow-right" size={15} />
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