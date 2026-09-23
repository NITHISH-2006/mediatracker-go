import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import { VgCard, VgCardContent } from '../components/ui/VgCard';
import { VgButton } from '../components/ui/VgButton';
import { VgBadge } from '../components/ui/VgBadge';
import { VgSelect } from '../components/ui/VgInput';
import { Icon } from '../components/ui/Icon';
import { useToast } from '../context/ToastContext';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp, ScaleIn } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import type { Media } from '../types';
import { STATUSES } from '../types';

type TypeFilter = 'all' | 'anime' | 'movie' | 'game';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [results, setResults] = useState<Media[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const [selected, setSelected] = useState<Media | null>(null);
  const [status, setStatus] = useState('Watching');
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const loadLibrary = () => {
    api
      .getLibrary()
      .then((lib) => setLibrary(lib.map((i) => i.media_id)))
      .catch(() => {});
  };

  const runSearch = useCallback(async (q: string, type: TypeFilter) => {
    setLoading(true);
    try {
      const res = q.trim() ? await api.searchMedia(q) : await api.getMedia();
      const filtered = type === 'all' ? res : res.filter((m) => m.media_type === type);
      setResults(filtered);
    } catch {
      setResults([]);
      toastError('Search failed');
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    runSearch('', 'all');
    loadLibrary();
  }, [runSearch]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      runSearch(query, typeFilter);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, typeFilter, runSearch]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    runSearch(query, typeFilter);
  };

  const openAdd = (media: Media) => {
    setSelected(media);
    setStatus('Watching');
    setProgress(0);
    setNotes('');
  };

  const addToLibrary = async () => {
    if (!selected) return;
    setAdding(true);
    try {
      await api.addToLibrary({
        media_id: selected.id,
        status,
        progress,
        notes,
      });
      toastSuccess(`Added "${selected.title}" to your library`);
      loadLibrary();
      setSelected(null);
    } catch (err) {
      const anyErr = err as { response?: { data?: { error?: string } } };
      toastError(anyErr.response?.data?.error ?? 'Failed to add to library');
    } finally {
      setAdding(false);
    }
  };

  const typeTabs: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'anime', label: 'Anime' },
    { value: 'movie', label: 'Movies' },
    { value: 'game', label: 'Games' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <PageHeader
          title="Search Media"
          subtitle="Find anime, movies & games to add to your library"
        />

        <FadeInUp delay={0.1}>
          <VgCard variant="elevated" className="mb-8">
            <VgCardContent className="p-6">
              <form onSubmit={search} className="flex gap-3 flex-wrap items-end">
                <div className="flex-1 min-w-[250px]">
                  <label className="form-label">Search</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      <Icon icon="search" size={18} />
                    </span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by title… e.g. 'Demon Slayer'"
                      className="vg-input pl-11 pr-12"
                    />
                    {loading && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sunflower">
                        <motion.span className="inline-flex" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Icon icon="refresh" size={16} />
                        </motion.span>
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  type="submit"
                  className="vg-btn vg-btn-primary h-fit flex items-center gap-2"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="search" size={17} />
                  Search
                </motion.button>
              </form>

              <div className="flex flex-wrap gap-2 mt-4">
                {typeTabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTypeFilter(t.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-300 ${
                      typeFilter === t.value
                        ? 'bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep text-night border-transparent'
                        : 'bg-night/50 text-text-secondary border-border-subtle/50 hover:text-sunflower hover:border-sunflower/30'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </VgCardContent>
          </VgCard>
        </FadeInUp>

        {results.length === 0 && !loading ? (
          <FadeInUp delay={0.2}>
            <motion.div
              className="bg-canvas/80 rounded-3xl border border-dashed border-border-subtle/50 p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div className="text-sunflower/60 mb-4 inline-flex" animate={{ rotate: [0, -3, 3, 0] }}>
                <Icon icon="search" size={64} />
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">No media found</p>
              <p className="text-text-secondary text-sm mb-4">
                Try a different search, or{' '}
                <a href="/add-media" className="text-sunflower hover:underline font-medium">
                  add it manually
                </a>
              </p>
            </motion.div>
          </FadeInUp>
        ) : (
          <FadeInUp delay={0.2}>
            <StaggerContainer delay={0.05}>
              {loading && results.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <VgCard key={i} variant="elevated" className="animate-pulse">
                      <VgCardContent className="p-0">
                        <div className="aspect-[16/10] bg-canvas/80" />
                        <div className="p-5 space-y-2">
                          <div className="h-5 w-3/4 bg-canvas/80 rounded-xl" />
                          <div className="h-4 w-1/2 bg-canvas/80 rounded-xl" />
                        </div>
                      </VgCardContent>
                    </VgCard>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 text-sm text-text-muted">
                  <Icon icon="sparkles" size={15} />
                  {results.length} result{results.length === 1 ? '' : 's'}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((media) => (
                  <StaggerItem key={media.id}>
                    <ScaleIn>
                      <MediaCard
                        media={media}
                        inLibrary={library.includes(media.id)}
                        onAdd={openAdd}
                      />
                    </ScaleIn>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </FadeInUp>
        )}

        {/* Add to Library Modal */}
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-canvas/95 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-border-subtle/50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-canvas">{selected.title}</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 rounded-xl bg-canvas/80 flex items-center justify-center text-text-muted hover:text-sunflower transition-colors"
                  aria-label="Close"
                >
                  <Icon icon="close" size={18} />
                </button>
              </div>
              <p className="text-text-secondary mb-4">{selected.description}</p>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Status</label>
                  <VgSelect
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none cursor-pointer"
                    options={STATUSES.map((s) => ({ value: s, label: s }))}
                  />
                </div>
                <div>
                  <label className="form-label">Progress (episodes/hours)</label>
                  <input
                    type="number"
                    min={0}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="vg-input"
                  />
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes…"
                    rows={2}
                    className="vg-input"
                  />
                </div>
                <VgButton
                  onClick={addToLibrary}
                  disabled={adding}
                  fullWidth
                  rightIcon={<Icon icon="plus" size={18} />}
                >
                  {adding ? 'Adding…' : 'Add to Library'}
                </VgButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}

function MediaCard({ media, inLibrary, onAdd }: { media: Media; inLibrary: boolean; onAdd: (m: Media) => void }) {
  return (
    <VgCard variant="elevated" className="overflow-hidden group">
      <VgCardContent className="p-0">
        <div className="aspect-[16/10] bg-gradient-to-br from-sunflower/10 to-orange-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <VgBadge variant="type" mediaType={media.media_type} size="md">
              {media.media_type.charAt(0).toUpperCase() + media.media_type.slice(1)}
            </VgBadge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl font-bold text-canvas mb-2 line-clamp-1">
            {media.title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">{media.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {media.genres.slice(0, 4).map((g) => (
              <VgBadge key={g} variant="genre" size="sm">
                {g}
              </VgBadge>
            ))}
            {media.genres.length > 4 && (
              <VgBadge variant="default" size="sm">
                +{media.genres.length - 4}
              </VgBadge>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>{media.year}</span>
              <span>•</span>
              <span className="capitalize">{media.media_type}</span>
            </div>
            {inLibrary ? (
              <motion.span
                className="text-sm text-emerald-400 font-medium flex items-center gap-1.5"
                animate={{ scale: [1, 1.05, 1] }}
              >
                <Icon icon="check-circle" size={16} />
                In Library
              </motion.span>
            ) : (
              <VgButton
                variant="secondary"
                size="sm"
                className="px-3 py-1.5"
                onClick={() => onAdd(media)}
              >
                <Icon icon="plus" size={16} />
                Add
              </VgButton>
            )}
          </div>
        </div>
      </VgCardContent>
    </VgCard>
  );
}