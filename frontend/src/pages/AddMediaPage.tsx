import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { VgCard, VgCardHeader, VgCardContent, VgCardFooter } from '../components/ui/VgCard';
import { VgInput, VgTextarea, VgSelect } from '../components/ui/VgInput';
import { Icon } from '../components/ui/Icon';
import { useToast } from '../context/ToastContext';
import PageWrapper, { PageHeader } from '../components/layout/PageWrapper';
import { FadeInUp } from '../components/animations/PageTransition';
import { motion } from 'framer-motion';
import { MEDIA_TYPES } from '../types';
import { AxiosError } from 'axios';

export default function AddMediaPage() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('anime');
  const [year, setYear] = useState(new Date().getFullYear());
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const genreList = genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean);
      if (genreList.length === 0) {
        throw new Error('At least one genre is required');
      }
      await api.addMedia({
        title,
        media_type: mediaType,
        year: Number(year),
        genres: genreList,
        description,
      });
      toastSuccess(`"${title}" added to the catalog`);
      navigate('/search');
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error || 'Failed to add media'
          : (err as Error).message || 'Failed to add media';
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
        <FadeInUp delay={0.1}>
          <PageHeader
            title="Add New Media"
            subtitle="Add an anime, movie or game to the catalog"
          />
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <VgCard variant="elevated">
            <VgCardHeader className="p-6">
              <h2 className="font-display text-2xl font-bold text-canvas">Media Details</h2>
              <p className="text-text-secondary mt-1">Fill in the information below to add to the catalog</p>
            </VgCardHeader>
            <VgCardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6" id="add-media-form">
                {error && (
                  <motion.div
                    className="bg-vermilion/20 border border-vermilion/30 rounded-xl p-3.5 flex items-center gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-vermilion flex-shrink-0">
                      <Icon icon="x-circle" size={20} />
                    </span>
                    <p className="text-vermilion text-sm flex-1">{error}</p>
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="text-vermilion hover:text-red-400"
                      aria-label="Dismiss error"
                    >
                      <Icon icon="close" size={16} />
                    </button>
                  </motion.div>
                )}

                <VgInput
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Attack on Titan"
                  required
                  leftIcon={<Icon icon="compass" size={18} />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <VgSelect
                    label="Type"
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    options={MEDIA_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                  />
                  <VgInput
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={1900}
                    max={new Date().getFullYear() + 5}
                    required
                    leftIcon={<Icon icon="clock" size={18} />}
                  />
                </div>

                <VgInput
                  label="Genres (comma-separated)"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="action, fantasy, drama"
                  required
                  helperText="Separate genres with commas"
                  leftIcon={<Icon icon="layers" size={18} />}
                />

                <VgTextarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Short description…"
                  leftIcon={<Icon icon="edit" size={18} />}
                />
              </form>
            </VgCardContent>
            <VgCardFooter className="p-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="vg-btn vg-btn-secondary flex-1"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                form="add-media-form"
                disabled={loading}
                className="vg-btn vg-btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-flex"
                    >
                      <Icon icon="refresh" size={18} />
                    </motion.span>
                    Adding…
                  </>
                ) : (
                  <>
                    <Icon icon="plus" size={18} />
                    Add Media
                  </>
                )}
              </motion.button>
            </VgCardFooter>
          </VgCard>
        </FadeInUp>
      </div>
    </PageWrapper>
  );
}