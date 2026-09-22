import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface VgCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'framed' | 'interactive';
  hover?: boolean;
  float?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const VgCard = forwardRef<HTMLDivElement, VgCardProps>(
  ({ variant = 'default', hover = true, float = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'vg-card relative overflow-hidden';
    const variantClasses = {
      default: '',
      elevated: 'shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]',
      framed: 'border-2 border-[rgba(244,211,94,0.2)]',
      interactive: 'cursor-pointer',
    };
    const floatClass = float ? 'float-gentle' : '';
    const hoverClass = hover ? 'hover-enabled' : '';

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${floatClass} ${hoverClass} ${className}`}
        initial={{ opacity: 0, y: 30, rotate: -2, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        whileHover={hover ? { y: -4, scale: 1.01, transition: { duration: 0.3 } } : undefined}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-emerald-600/10 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

VgCard.displayName = 'VgCard';

export interface VgCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const VgCardHeader = forwardRef<HTMLDivElement, VgCardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-5 border-b border-border-subtle/50 ${className}`} {...props}>
      {children}
    </div>
  )
);

VgCardHeader.displayName = 'VgCardHeader';

export interface VgCardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const VgCardContent = forwardRef<HTMLDivElement, VgCardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);

VgCardContent.displayName = 'VgCardContent';

export interface VgCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const VgCardFooter = forwardRef<HTMLDivElement, VgCardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-5 border-t border-border-subtle/50 bg-gradient-to-t from-night/50 to-transparent ${className}`} {...props}>
      {children}
    </div>
  )
);

VgCardFooter.displayName = 'VgCardFooter';