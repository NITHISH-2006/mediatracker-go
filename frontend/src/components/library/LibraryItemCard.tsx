import { motion, AnimatePresence } from 'framer-motion';
import { VgCard, VgCardHeader, VgCardFooter } from '@/components/ui/VgCard';
import { VgBadge } from '@/components/ui/VgBadge';
import type { LibraryItem, Media } from '@/types';

const STATUSES = ['Watching', 'Completed', 'Dropped', 'Planned'] as const;

const STATUS_STYLES: Record<string, string> = {
  Watching: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Dropped: 'bg-vermilion/20 text-red-300 border-vermilion/30',
  Planned: 'bg-lavender/20 text-lavender-light border-lavender/30',
};

const typeIconsMap = {
  anime: '📺',
  movie: '🎬',
  game: '🎮',
};

interface LibraryItemCardProps {
  item: LibraryItem;
  media: Media | undefined;
  expanded: boolean;
  onExpand: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateProgress: (progress: number) => void;
  onUpdateNotes: (notes: string) => void;
  onRemove: () => void;
}

export function LibraryItemCard({
  item,
  media,
  expanded,
  onExpand,
  onUpdateStatus,
  onUpdateProgress,
  onUpdateNotes,
  onRemove,
}: LibraryItemCardProps) {
  const typeLabel = media?.media_type ? media.media_type.charAt(0).toUpperCase() + media.media_type.slice(1) : 'Media';
  const statusStylesFor = (s: string) =>
    `px-4 py-2 rounded-xl font-body font-medium text-sm border transition-all duration-300 ${
      item.status === s
        ? `${STATUS_STYLES[s]} border-sunflower/40 shadow-lg shadow-sunflower/10`
        : 'bg-canvas/80 text-text-secondary hover:text-sunflower hover:border-sunflower/30 border-border-subtle/50'
    }`;

  return (
    <motion.div layout initial={false} animate={{ height: 'auto' }}>
      <VgCard variant={expanded ? 'framed' : 'default'} className="overflow-hidden transition-all duration-500">
        <VgCardHeader className="p-4 lg:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">{typeIconsMap[media?.media_type as keyof typeof typeIconsMap] || '📦'}</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-canvas truncate">
                    {media?.title ?? 'Unknown media'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {typeLabel}
                    </span>
                    {item.status && (
                      <VgBadge status={item.status.toLowerCase() as 'watching' | 'completed' | 'dropped' | 'planned'} size="sm">
                        {item.status}
                      </VgBadge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={onExpand}
                    className="h-10 w-10 rounded-xl bg-canvas/80 text-text-secondary hover:text-sunflower hover:bg-sunflower/10 flex items-center justify-center transition-all duration-300"
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      ▼
                    </motion.span>
                  </button>

                  <button
                    onClick={onRemove}
                    className="h-10 w-10 rounded-xl bg-canvas/80 text-vermilion hover:text-red-400 hover:bg-vermilion/10 flex items-center justify-center transition-all duration-300"
                    aria-label="Remove from library"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </VgCardHeader>

        {expanded && (
          <AnimatePresence>
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <VgCardFooter className="p-4 lg:p-5 pb-5 border-t border-border-subtle/50 bg-gradient-to-t from-night/30 to-transparent">
                <div className="space-y-4">
                  {/* Status Selector */}
                  <div>
                    <label className="form-label">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => onUpdateStatus(s)}
                          className={statusStylesFor(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <label className="form-label">Progress (episodes/hours)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        value={item.progress}
                        onChange={(e) => onUpdateProgress(Math.max(0, Number(e.target.value)))}
                        className="vg-input w-24 text-center"
                      />
                      <div className="flex-1">
                        <div className="vg-genre-bar" style={{ height: '8px' }}>
                          <div
                            className="vg-genre-fill"
                            style={{ width: `${Math.min(100, Math.max(0, item.progress))}%`, background: 'linear-gradient(90deg, #f4d35e, #e07a3d, #2d6a4f)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="form-label">Notes</label>
                    <textarea
                      placeholder="Add your thoughts..."
                      rows={3}
                      value={item.notes}
                      onChange={(e) => onUpdateNotes(e.target.value)}
                      className="vg-input"
                    />
                  </div>
                </div>
              </VgCardFooter>
            </motion.div>
          </AnimatePresence>
        )}
      </VgCard>
    </motion.div>
  );
}