import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { StaggerContainer, StaggerItem, FadeInUp } from '../components/animations/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import type { LibraryItem, Media } from '../types';
import { LibraryItemCard } from '../components/library/LibraryItemCard';

const STATUSES = ['Watching', 'Completed', 'Dropped', 'Planned'] as const;

const statusColors = {
  Watching: 'bg-blue-500',
  Completed: 'bg-emerald-500',
  Dropped: 'bg-red-500',
  Planned: 'bg-purple-500',
};

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [tab, setTab] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.getLibrary(), api.getMedia()])
      .then(([lib, media]) => {
        setItems(lib);
        const map: Record<string, Media> = {};
        media.forEach((m) => (map[m.id] = m));
        setMediaMap(map);
      })
      .catch(() => setError('Failed to load library'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(
    () => (tab === 'All' ? items : items.filter((i) => i.status === tab)),
    [items, tab]
  );

  const updateStatus = async (item: LibraryItem, status: string) => {
    await api.updateLibraryItem(item.id, { status, progress: item.progress, notes: item.notes });
    load();
  };

  const updateProgress = async (item: LibraryItem, progress: number) => {
    await api.updateLibraryItem(item.id, { status: item.status, progress, notes: item.notes });
    load();
  };

  const updateNotes = async (item: LibraryItem, notes: string) => {
    await api.updateLibraryItem(item.id, { status: item.status, progress: item.progress, notes });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this item from your library?')) return;
    await api.deleteLibraryItem(id);
    load();
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
        />

        {error && (
          <motion.div
            className="bg-vermilion/20 border border-vermilion/30 rounded-2xl p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-vermilion">{error}</p>
          </motion.div>
        )}

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
                {s} <span className="text-text-muted">({items.filter(i => i.status === s).length})</span>
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
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -3, 3, 0] }}
              >
                📚
              </motion.div>
              <p className="text-text-secondary text-lg mb-4">
                No items in this list yet
              </p>
              <p className="text-text-secondary text-sm mb-6">
                Head to{' '}
                <a href="/search" className="text-sunflower hover:underline font-medium">
                  Search
                </a>{' '}
                to add media
              </p>
            </motion.div>
          </FadeInUp>
        ) : (
          <FadeInUp delay={0.2}>
            <StaggerContainer delay={0.05}>
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
                      </motion.div>
                    </AnimatePresence>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </FadeInUp>
        )}
      </div>
    </PageWrapper>
  );
}