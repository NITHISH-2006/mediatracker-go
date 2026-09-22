import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { VgCard } from '../ui/VgCard';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
}

export default function PageWrapper({ children, className = '', showNavbar = true }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-night relative">
      {/* Global starfield background */}
      <div className="starry-night" aria-hidden="true" />

      {/* Subtle vortex overlay */}
      <div className="vortex-bg" aria-hidden="true" />

      {showNavbar && <Navbar />}

      <motion.main
        className={`page-wrapper ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="main-content">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      className="mb-8 lg:mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-display text-4xl lg:text-5xl font-bold text-canvas mb-2 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-text-secondary max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {action}
          </motion.div>
        )}
      </div>

      {/* Painterly divider */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-sunflower/30 to-transparent rounded-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-sunflower via-orange-500 to-emerald opacity-50 blur-md" />
      </div>
    </motion.div>
  );
}

export function SectionCard({ title, subtitle, children, className = '', icon, action }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <VgCard variant="default" className={`overflow-visible ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunflower/20 to-orange-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 3 }}
              >
                {icon}
              </motion.div>
            )}
            <div>
              <h2 className="text-display text-2xl font-bold text-canvas">{title}</h2>
              {subtitle && <p className="text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && (
            <motion.div
              className="flex-shrink-0 self-start"
              whileHover={{ scale: 1.05 }}
            >
              {action}
            </motion.div>
          )}
        </div>
        {children}
      </div>
    </VgCard>
  );
}