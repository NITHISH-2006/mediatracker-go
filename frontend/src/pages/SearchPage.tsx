import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import { VgCard, VgCardContent } from '../components/ui/VgCard';
import { VgButton } from '../components/ui/VgButton';
import { VgBadge } from '../components/ui/VgBadge';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp, ScaleIn } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import type { Media } from '../types';
import { STATUSES, STATUS_COLORS } from '../types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Media | null>(null);
  const [status, setStatus] = useState('Watching');
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const loadLibrary = () => {
    api.getLibrary().then((lib) => setLibrary(lib.map((i) => i.media_id)));
  };

  useEffect(() => {
    api.getMedia().then(setResults).catch(() => {});
    loadLibrary();
  }, []);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = query.trim() ? await api.searchMedia(query) : await api.getMedia();
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = (media: Media) => {
    setSelected(media);
    setStatus('Watching');
    setProgress(0);
    setNotes('');
    setMessage('');
  };

  const addToLibrary = async () => {
    if (!selected) return;
    setAdding(true);
    setMessage('');
    try {
      await api.addToLibrary({
        media_id: selected.id,
        status,
        progress,
        notes,
      });
      setMessage('✅ Added to library');
      loadLibrary();
    } catch (err) {
      const anyErr = err as { response?: { data?: { error?: string } } };
      setMessage(`❌ ${anyErr.response?.data?.error ?? 'Failed to add'}`);
    } finally {
      setAdding(false);
    }
  };

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
              <form onSubmit={search} className="flex gap-3 flex-wrap">
                <motion.div
                  className="flex-1 min-w-[250px]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <label className="form-label">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by title… e.g. 'Demon Slayer'"
                      className="vg-input pr-12"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                      🔍
                    </div>
                  </div>
                </motion.div>
                <motion.button
                  type="submit"
                  className="vg-btn vg-btn-primary h-fit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {loading ? 'Searching…' : 'Search'}
                </motion.button>
              </form>
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
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -3, 3, 0] }}
              >
                🔍
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((media) => (
                  <StaggerItem key={media.id}>
                    <ScaleIn>
                      <MediaCard
                        key={media.id}
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
                <motion.button
                  onClick={() => setSelected(null)}
                  className="text-text-muted hover:text-sunflower transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  ✕
                </motion.button>
              </div>
              <p className="text-text-secondary mb-4">{selected.description}</p>

              {message && (
                <motion.div
                  className={`text-sm mb-4 rounded-xl p-3 ${
                    message.startsWith('✅') 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-vermilion/20 text-red-300 border border-vermilion/30'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`vg-input vg-select appearance-none cursor-pointer ${STATUS_COLORS[status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
                <motion.button
                  onClick={addToLibrary}
                  disabled={adding}
                  className="vg-btn vg-btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {adding ? 'Adding…' : 'Add to Library'}
                </motion.button>
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
                className="text-sm text-emerald-400 font-medium flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
              >
                ✓ In Library
              </motion.span>
            ) : (
              <VgButton
                variant="secondary"
                size="sm"
                className="px-3 py-1.5"
                onClick={() => onAdd(media)}
              >
                + Add
              </VgButton>
            )}
          </div>
        </div>
      </VgCardContent>
    </VgCard>
  );
}