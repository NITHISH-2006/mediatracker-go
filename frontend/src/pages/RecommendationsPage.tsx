import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { VgCard, VgCardContent } from '../components/ui/VgCard';
import { VgButton } from '../components/ui/VgButton';
import { VgBadge } from '../components/ui/VgBadge';
import { Icon } from '../components/ui/Icon';
import { useToast } from '../context/ToastContext';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp, ScaleIn } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import type { RecommendedItem } from '../types';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { error: toastError } = useToast();

  useEffect(() => {
    api
      .getRecommendations()
      .then((res) => setItems(res.recommended_media ?? []))
      .catch(() => {
        setError('Failed to load recommendations');
        toastError('Could not load recommendations');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <PageHeader title="Recommendations" subtitle="Loading your personalized picks..." />
          <StaggerContainer delay={0.1}>
            {[...Array(6)].map((_, i) => (
              <StaggerItem key={i}>
                <VgCard variant="elevated" className="animate-pulse">
                  <VgCardContent className="p-6">
                    <div className="aspect-[16/10] bg-canvas/80 rounded-2xl" />
                    <div className="mt-4 h-6 w-3/4 bg-canvas/80 rounded-xl" />
                    <div className="mt-2 h-4 w-1/2 bg-canvas/80 rounded-xl" />
                  </VgCardContent>
                </VgCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <PageHeader title="Recommendations" subtitle="Picked for you based on what you watch" />

        {error && (
          <FadeInUp delay={0.1}>
            <motion.div
              className="bg-vermilion/20 border border-vermilion/30 rounded-2xl p-4 mb-8 flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Icon icon="x-circle" size={20} className="text-vermilion flex-shrink-0" />
              <p className="text-vermilion">{error}</p>
            </motion.div>
          </FadeInUp>
        )}

        {!error && items.length === 0 ? (
          <FadeInUp delay={0.2}>
            <motion.div
              className="bg-canvas/80 rounded-3xl border border-dashed border-border-subtle/50 p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div className="text-sunflower/60 mb-4 inline-flex" animate={{ rotate: [0, -3, 3, 0] }}>
                <Icon icon="sparkles" size={64} />
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">No recommendations yet</p>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                Add some media to your library (Completed or Watching) and we'll suggest similar titles based on your taste
              </p>
              <button onClick={() => navigate('/search')} className="vg-btn vg-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold">
                <Icon icon="search" size={18} />
                Go to Search
              </button>
            </motion.div>
          </FadeInUp>
        ) : (
          <>
            <FadeInUp delay={0.1}>
              <VgCard variant="elevated" className="mb-8">
                <VgCardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 text-sunflower flex items-center justify-center"
                      animate={{ rotate: [0, -2, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Icon icon="sparkles" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-canvas">Why These Recommendations?</h3>
                      <p className="text-text-secondary text-sm">
                        Each recommendation is scored based on your completed and watching items. Genres from completed titles count double.
                      </p>
                    </div>
                  </div>
                </VgCardContent>
              </VgCard>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <StaggerContainer delay={0.08}>
                {items.map((item, index) => (
                  <StaggerItem key={item.id}>
                    <ScaleIn delay={index * 0.02}>
                      <RecommendationCard item={item} index={index} />
                    </ScaleIn>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeInUp>

            {items.length < 3 && (
              <FadeInUp delay={0.3}>
                <VgCard variant="elevated" className="mt-8">
                  <VgCardContent className="p-6 text-center">
                    <motion.div className="text-sunflower/60 mb-3 inline-flex" animate={{ rotate: [0, -3, 3, 0] }}>
                      <Icon icon="sparkles" size={48} />
                    </motion.div>
                    <h3 className="font-display text-xl font-bold text-canvas mb-2">Want More Recommendations?</h3>
                    <p className="text-text-secondary mb-4">
                      Add more media to your library with different genres to unlock personalized picks
                    </p>
                    <button onClick={() => navigate('/search')} className="vg-btn vg-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold">
                      <Icon icon="search" size={18} />
                      Explore More Media
                    </button>
                  </VgCardContent>
                </VgCard>
              </FadeInUp>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function RecommendationCard({ item, index }: { item: RecommendedItem; index: number }) {
  const isTop = index === 0;
  const [adding, setAdding] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();
  const genreGradient = 'linear-gradient(135deg, rgba(244,211,94,0.35) 0%, rgba(224,122,61,0.35) 55%, rgba(45,106,79,0.45) 100%)';

  const handleAdd = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await api.addToLibrary({ media_id: item.id, status: 'Planned' });
      toastSuccess(`Added "${item.title}" to your Planned list`);
    } catch (err) {
      const anyErr = err as { response?: { data?: { error?: string } } };
      toastError(anyErr.response?.data?.error ?? 'Could not add to library');
    } finally {
      setAdding(false);
    }
  };

  return (
    <VgCard variant={isTop ? 'framed' : 'elevated'} className="overflow-hidden group relative">
      {isTop && (
        <motion.div
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-sunflower to-orange-500 flex items-center justify-center text-night font-bold text-xs z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          #1
        </motion.div>
      )}

      <VgCardContent className="p-0">
        <div className="aspect-[16/10] relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: genreGradient }} />
          <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
            {item.genres.slice(0, 3).map((g) => (
              <VgBadge key={g} variant="genre" size="sm">
                {g}
              </VgBadge>
            ))}
            {item.genres.length > 3 && (
              <VgBadge variant="default" size="sm">
                +{item.genres.length - 3}
              </VgBadge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <VgBadge variant="type" mediaType={item.media_type as 'anime' | 'movie' | 'game'} size="sm">
              {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}
            </VgBadge>
          </div>
          <div className="absolute top-4 left-4">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-sunflower/30 to-orange-500/30 flex items-center justify-center text-sunflower font-bold text-xs border border-sunflower/40"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {index + 1}
            </motion.div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display text-xl font-bold text-canvas mb-3 line-clamp-1">
            {item.title}
          </h3>

          <div className="vg-genre-bar mb-4" style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="vg-genre-fill"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #f4d35e 0%, #e07a3d 50%, #2d6a4f 100%)',
              }}
            />
          </div>

          <motion.p
            className="text-text-secondary text-sm italic leading-relaxed mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {item.match_reason}
          </motion.p>

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>{item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}</span>
              <span className="text-border-subtle">•</span>
              <span>{item.genres.slice(0, 2).join(', ')}{item.genres.length > 2 ? '…' : ''}</span>
            </div>
            <VgButton
              variant={adding ? 'ghost' : 'secondary'}
              size="sm"
              className="px-3 py-1.5"
              onClick={handleAdd}
              disabled={adding}
              leftIcon={adding ? <Icon icon="refresh" size={15} /> : <Icon icon="plus" size={15} />}
            >
              {adding ? 'Adding…' : 'Add to Library'}
            </VgButton>
          </div>
        </div>
      </VgCardContent>
    </VgCard>
  );
}