import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface VgBadgeProps extends HTMLMotionProps<'span'> {
  variant?: 'status' | 'type' | 'genre' | 'default';
  status?: 'watching' | 'completed' | 'dropped' | 'planned';
  mediaType?: 'anime' | 'movie' | 'game';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const statusStyles = {
  watching: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  dropped: 'bg-vermilion/20 text-red-300 border-vermilion/30',
  planned: 'bg-lavender/20 text-lavender-light border-lavender/30',
};

const typeStyles = {
  anime: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  movie: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  game: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const sizeStyles = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const VgBadge = forwardRef<HTMLSpanElement, VgBadgeProps>(
  ({
    variant = 'default',
    status,
    mediaType,
    size = 'md',
    glow = false,
    className = '',
    children,
    ...props
  }, ref) => {
    let variantClass = '';
    if (variant === 'status' && status) {
      variantClass = statusStyles[status];
    } else if (variant === 'type' && mediaType) {
      variantClass = typeStyles[mediaType];
    } else if (variant === 'genre') {
      variantClass = 'bg-sunflower/20 text-sunflower border-sunflower/30';
    } else {
      variantClass = 'bg-ultramarine/50 text-canvas border-border-subtle';
    }

    const glowClass = glow ? 'shadow-lg shadow-sunflower/30' : '';

    return (
      <motion.span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 font-semibold
          border rounded-full
          ${sizeStyles[size]}
          ${variantClass}
          ${glowClass}
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }
);

VgBadge.displayName = 'VgBadge';

interface VgGenreBarProps {
  percentage: number;
  color?: 'sunflower' | 'orange' | 'emerald' | 'blue' | 'purple';
  height?: number;
  showLabel?: boolean;
  label?: string;
}

const genreGradients = {
  sunflower: ['#f4d35e', '#e07a3d', '#2d6a4f'],
  orange: ['#e07a3d', '#d94a1c', '#f4d35e'],
  emerald: ['#2d6a4f', '#40916c', '#2ec4b6'],
  blue: ['#1a3c6e', '#3a7bd5', '#2ec4b6'],
  purple: ['#7c3aed', '#9b8c9a', '#ec4899'],
};

export const VgGenreBar = ({
  percentage,
  color = 'sunflower',
  height = 10,
  showLabel = false,
  label,
}: VgGenreBarProps) => {
  const [from, mid, to] = genreGradients[color];
  const background = `linear-gradient(90deg, ${from} 0%, ${mid} 50%, ${to} 100%)`;

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-text-secondary">{label || 'Progress'}</span>
          <span className="text-sm font-semibold text-sunflower">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="vg-genre-bar" style={{ height: `${height}px` }} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="vg-genre-fill"
          style={{ height: '100%', borderRadius: '9999px', background }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
};

export interface VgProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: 'sunflower' | 'orange' | 'emerald' | 'blue';
  showPercentage?: boolean;
}

export const VgProgressRing = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = 'sunflower',
  showPercentage = true,
}: VgProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorGradients = {
    sunflower: 'url(#progress-gradient-sunflower)',
    orange: 'url(#progress-gradient-orange)',
    emerald: 'url(#progress-gradient-emerald)',
    blue: 'url(#progress-gradient-blue)',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="vg-progress-ring">
        <defs>
          <linearGradient id="progress-gradient-sunflower" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4d35e" />
            <stop offset="50%" stopColor="#e07a3d" />
            <stop offset="100%" stopColor="#2d6a4f" />
          </linearGradient>
          <linearGradient id="progress-gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e07a3d" />
            <stop offset="50%" stopColor="#d94a1c" />
            <stop offset="100%" stopColor="#f4d35e" />
          </linearGradient>
          <linearGradient id="progress-gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d6a4f" />
            <stop offset="50%" stopColor="#40916c" />
            <stop offset="100%" stopColor="#2ec4b6" />
          </linearGradient>
          <linearGradient id="progress-gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a3c6e" />
            <stop offset="50%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#2ec4b6" />
          </linearGradient>
        </defs>
        <circle
          className="vg-progress-ring-bg"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <motion.circle
          className="vg-progress-ring-fill"
          stroke={colorGradients[color]}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        />
      </svg>
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="text-sunflower">{Math.round(percentage)}%</span>
        </motion.div>
      )}
    </div>
  );
};