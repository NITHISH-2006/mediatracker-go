import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Icon } from '../components/ui/Icon';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp } from '../components/animations/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import type { LibraryItem, Media } from '../types';
import { LibraryItemCard } from '../components/library/LibraryItemCard';

const STATUSES = ['Watching', 'Completed', 'Dropped', 'Planned'] as const;
const TYPE_FILTERS = ['All', 'anime', 'movie', 'game'] as const;

const statusColors = {
  Watching: 'bg-blue-500',
  Completed: 'bg-emerald-500',
  Dropped: 'bg-red-500',
  Planned: 'bg-purple-500',
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [tab, setTab] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.getLibrary(), api.getMedia()])
      .then(([lib, media]) => {
        setItems(lib);
        const map: Record<string, Media> = {};
        media.forEach((m) => (map[m.id] = m));
        setMediaMap(map);
      })
      .catch(() => {
        setError('Failed to load library');
        toastError('Could not load your library');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (tab !== 'All' && i.status !== tab) return false;
      if (typeFilter !== 'All' && mediaMap[i.media_id]?.media_type !== typeFilter) return false;
      if (q && !(mediaMap[i.media_id]?.title.toLowerCase().includes(q) ?? false)) return false;
      return true;
    });
  }, [items, tab, typeFilter, search, mediaMap]);

  const updateStatus = async (item: LibraryItem, status: string) => {
    try {
      await api.updateLibraryItem(item.id, { status, progress: item.progress, notes: item.notes });
      toastSuccess(`Moved "${mediaMap[item.media_id]?.title ?? 'item'}" to ${status}`);
      load();
    } catch {
      toastError('Could not update status');
    }
  };

  const updateProgress = async (item: LibraryItem, progress: number) => {
    try {
      await api.updateLibraryItem(item.id, { status: item.status, progress, notes: item.notes });
      load();
    } catch {
      toastError('Could not update progress');
    }
  };

  const updateNotes = async (item: LibraryItem, notes: string) => {
    try {
      await api.updateLibraryItem(item.id, { status: item.status, progress: item.progress, notes });
      load();
    } catch {
      toastError('Could not save notes');
    }
  };

  const remove = async (id: string) => {
    if (confirmRemove !== id) {
      setConfirmRemove(id);
      return;
    }
    try {
      setConfirmRemove(null);
      const target = items.find((i) => i.id === id);
      await api.deleteLibraryItem(id);
      toastSuccess(`Removed "${target ? mediaMap[target.media_id]?.title ?? '' : 'item'}" from your library`);
      load();
    } catch {
      toastError('Could not remove item');
      setConfirmRemove(null);
    }
  };

  const exportCsv = () => {
    const rows = filtered.map((item) => {
      const media = mediaMap[item.media_id];
      return {
        title: media?.title ?? 'Unknown',
        type: media?.media_type ?? '',
        year: media?.year ?? '',
        genres: media?.genres.join(' | ') ?? '',
        status: item.status,
        progress: item.progress,
        notes: (item.notes ?? '').replace(/,/g, ';'),
      };
    });
    const header = 'title,type,year,genres,status,progress,notes';
    const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mediatracker-library.csv';
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess(`Exported ${rows.length} item${rows.length === 1 ? '' : 's'} to CSV`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <PageHeader title="My Library" subtitle="Loading your collection..." />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-24 bg-canvas/80 rounded-2xl border border-border-subtle/50 animate-pulse"
              />
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <PageHeader
          title="My Library"
          subtitle="Manage everything you're tracking"
          action={
            <button
              onClick={exportCsv}
              disabled={items.length === 0}
              className="vg-btn vg-btn-secondary px-4 py-2.5 text-sm flex items-center gap-2"
            >
              <Icon icon="download" size={16} />
              Export CSV
            </button>
          }
        />

        {error && (
          <motion.div
            className="bg-vermilion/20 border border-vermilion/30 rounded-2xl p-4 mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Icon icon="x-circle" size={20} className="text-vermilion flex-shrink-0" />
            <p className="text-vermilion">{error}</p>
          </motion.div>
        )}

        {/* Search + Type filter */}
        <FadeInUp delay={0.05}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Icon icon="search" size={18} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your library by title…"
                className="vg-input pl-11"
              />
            </div>
            <div className="flex gap-2">
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-all duration-300 capitalize ${
                    typeFilter === t
                      ? 'bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep text-night border-transparent'
                      : 'bg-night/50 text-text-secondary border-border-subtle/50 hover:text-sunflower hover:border-sunflower/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Status Filter Tabs */}
        <FadeInUp delay={0.1}>
          <div className="tab-group mb-8">
            <button
              onClick={() => setTab('All')}
              className={`tab-btn ${tab === 'All' ? 'active' : ''}`}
            >
              All <span className="text-text-muted">({items.length})</span>
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={`tab-btn ${tab === s ? 'active' : ''}`}
                style={{
                  background: tab === s
                    ? `linear-gradient(135deg, ${statusColors[s]}, ${statusColors[s]}dd)`
                    : undefined,
                }}
              >
                {s} <span className="text-text-muted">({items.filter((i) => i.status === s).length})</span>
              </button>
            ))}
          </div>
        </FadeInUp>

        {filtered.length === 0 ? (
          <FadeInUp delay={0.2}>
            <motion.div
              className="bg-canvas/80 rounded-3xl border border-dashed border-border-subtle/50 p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div className="text-sunflower/60 mb-4 inline-flex" animate={{ rotate: [0, -3, 3, 0] }}>
                <Icon icon="book" size={64} />
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">
                {items.length === 0 ? 'Your library is empty' : 'No items match your filters'}
              </p>
              <p className="text-text-secondary text-sm mb-6">
                Head to{' '}
                <button onClick={() => navigate('/search')} className="text-sunflower hover:underline font-medium">
                  Search
                </button>{' '}
                to add media
              </p>
            </motion.div>
          </FadeInUp>
        ) : (
          <FadeInUp delay={0.2}>
            <StaggerContainer delay={0.05}>
              <div className="space-y-4">
                {filtered.map((item) => {
                  const media = mediaMap[item.media_id];
                  return (
                    <StaggerItem key={item.id}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={item.id}
                          className="relative overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -300, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <LibraryItemCard
                            item={item}
                            media={media}
                            expanded={expandedItem === item.id}
                            onExpand={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            onUpdateStatus={(status) => updateStatus(item, status)}
                            onUpdateProgress={(progress) => updateProgress(item, progress)}
                            onUpdateNotes={(notes) => updateNotes(item, notes)}
                            onRemove={() => remove(item.id)}
                          />
                          {confirmRemove === item.id && (
                            <motion.div
                              className="absolute inset-0 z-10 bg-night/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-3xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <p className="text-canvas font-body font-semibold">
                                Remove "{media?.title ?? 'this item'}"?
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => remove(item.id)}
                                  className="px-4 py-2 rounded-xl text-sm font-body font-semibold bg-vermilion text-canvas"
                                >
                                  Yes, remove
                                </button>
                                <button
                                  onClick={() => setConfirmRemove(null)}
                                  className="px-4 py-2 rounded-xl text-sm font-body font-semibold bg-canvas/10 text-text-secondary hover:text-canvas"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          </FadeInUp>
        )}
      </div>
    </PageWrapper>
  );
}