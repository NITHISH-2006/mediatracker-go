import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { VgCard, VgCardHeader, VgCardContent, VgCardFooter } from '@/components/ui/VgCard';
import { VgInput, VgTextarea, VgSelect } from '@/components/ui/VgInput';
import PageWrapper, { PageHeader } from '@/components/layout/PageWrapper';
import { FadeInUp } from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import { MEDIA_TYPES } from '../types';
import { AxiosError } from 'axios';

export default function AddMediaPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('anime');
  const [year, setYear] = useState(new Date().getFullYear());
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setTimeout(() => navigate('/search'), 1500);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to add media');
      } else {
        setError((err as Error).message || 'Failed to add media');
      }
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

        {success && (
          <FadeInUp delay={0.2}>
            <motion.div
              className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
              >
                🎨
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-emerald-300 mb-2">
                Media Added Successfully!
              </h2>
              <p className="text-emerald-200">Redirecting to search...</p>
            </motion.div>
          </FadeInUp>
        )}

        {!success && (
          <>
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
                        className="bg-vermilion/20 border border-vermilion/30 rounded-xl p-4 flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span className="text-vermilion flex-1">{error}</span>
                        <motion.button
                          onClick={() => setError('')}
                          className="text-vermilion hover:text-red-400"
                          whileHover={{ scale: 1.1 }}
                        >
                          ✕
                        </motion.button>
                      </motion.div>
                    )}

                    <VgInput
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Attack on Titan"
                      required
                      leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      }
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <VgSelect
                        label="Type"
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value)}
                        options={MEDIA_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                      />
                      <VgInput
                        label="Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        min={1900}
                        max={new Date().getFullYear() + 5}
                        required
                        leftIcon={
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        }
                      />
                    </div>

                    <VgInput
                      label="Genres (comma-separated)"
                      value={genres}
                      onChange={(e) => setGenres(e.target.value)}
                      placeholder="action, fantasy, drama"
                      required
                      helperText="Separate genres with commas"
                      leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      }
                    />

                    <VgTextarea
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Short description…"
                      leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12s5-3 8-3 8 3 8 3" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 12c0 2.5-2 4-4 4s-4-1.5-4-4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      }
                    />
                  </form>
                </VgCardContent>
                <VgCardFooter className="p-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    onClick={() => navigate('/search')}
                    className="vg-btn vg-btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    form="add-media-form"
                    disabled={loading}
                    className="vg-btn vg-btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </motion.span>
                        Adding…
                      </>
                    ) : (
                      'Add Media'
                    )}
                  </motion.button>
                </VgCardFooter>
              </VgCard>
            </FadeInUp>
          </>
        )}
      </div>
    </PageWrapper>
  );
}