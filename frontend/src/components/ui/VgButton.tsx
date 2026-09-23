import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface VgButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const VgButton = forwardRef<HTMLButtonElement, VgButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-body font-semibold
      rounded-xl
      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night
      disabled:opacity-50 disabled:cursor-not-allowed
      overflow-hidden
    `;

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep
        text-night shadow-lg shadow-orange-500/30
        hover:shadow-xl hover:shadow-orange-500/40
        active:scale-[0.97]
      `,
      secondary: `
        bg-transparent border-2 border-sunflower text-sunflower
        hover:bg-sunflower/10 hover:text-canvas
        active:bg-sunflower/20
      `,
      ghost: `
        bg-transparent text-text-secondary
        hover:text-sunflower hover:bg-sunflower/10
        active:bg-sunflower/10
      `,
      accent: `
        bg-gradient-to-br from-emerald to-emerald-light
        text-canvas shadow-lg shadow-emerald/30
        hover:shadow-xl hover:shadow-emerald/40
        active:scale-[0.97]
      `,
      danger: `
        bg-gradient-to-br from-vermilion to-orange
        text-canvas shadow-lg shadow-red-500/30
        hover:shadow-xl hover:shadow-red-500/40
        active:scale-[0.97]
      `,
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${widthStyle}
          ${className}
        `}
        whileHover={!isDisabled ? { scale: 1.02, y: -2 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...props}
      >
        {loading && (
          <motion.span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.span>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className={loading ? 'invisible' : ''}>{children as ReactNode}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 0.15 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    );
  }
);

VgButton.displayName = 'VgButton';

export interface VgIconButtonProps extends HTMLMotionProps<'button'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  'aria-label': string;
}

export const VgIconButton = forwardRef<HTMLButtonElement, VgIconButtonProps>(
  ({ size = 'md', variant = 'ghost', className = '', children, 'aria-label': ariaLabel, ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-9 h-9',
      md: 'w-11 h-11',
      lg: 'w-13 h-13',
    };

    const variantStyles = {
      primary: 'bg-gradient-to-br from-sunflower via-orange-500 to-sunflower-deep text-night',
      secondary: 'bg-transparent border-2 border-sunflower text-sunflower hover:bg-sunflower/10',
      ghost: 'bg-transparent text-text-secondary hover:text-sunflower hover:bg-sunflower/10',
    };

    return (
      <motion.button
        ref={ref}
        aria-label={ariaLabel}
        className={`
          inline-flex items-center justify-center rounded-xl
          font-body transition-all duration-300
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

VgIconButton.displayName = 'VgIconButton';