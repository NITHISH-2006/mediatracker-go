import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export interface PageTransitionProps {
  children: ReactNode;
  mode?: 'swirl' | 'fade' | 'brush' | 'slide';
  duration?: number;
}

export function PageTransition({ children, mode = 'swirl', duration = 0.45 }: PageTransitionProps) {
  const location = useLocation();

  const variants = {
    swirl: {
      initial: { opacity: 0, scale: 0.96, y: 12, rotate: -1.5, filter: 'blur(6px)' },
      animate: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, scale: 1.02, y: -8, rotate: 1, filter: 'blur(6px)' },
    },
    fade: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
    },
    brush: {
      initial: { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
      animate: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
      exit: { opacity: 0, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' },
    },
    slide: {
      initial: { opacity: 0, x: 40, filter: 'blur(6px)' },
      animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, x: -40, filter: 'blur(6px)' },
    },
  };

  const transition = {
    duration,
    ease: [0.23, 1, 0.32, 1] as const,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants[mode]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function StaggerContainer({ children, delay = 0.1, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          transition: {
            staggerChildren: delay,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, delay = 0, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      variants={{
        hidden: { opacity: 0, y: 30, rotate: -2, scale: 0.95 },
        show: {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1] as const,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as const, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
}

export function SwirlReveal({ children, delay = 0, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, scale: 0.7, rotate: -15, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] as const, delay }}
    >
      {children}
    </motion.div>
  );
}

export function BrushReveal({ children, delay = 0, direction = 'left', ...props }: {
  children: ReactNode;
  delay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}) {
  const clipPaths = {
    left: { hidden: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    right: { hidden: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    top: { hidden: 'polygon(0 0, 100% 0, 100% 0, 0 0)', visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    bottom: { hidden: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
  };

  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, clipPath: clipPaths[direction].hidden }}
      animate={{ opacity: 1, clipPath: clipPaths[direction].visible }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] as const, delay }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ children, intensity = 1, ...props }: {
  children: ReactNode;
  intensity?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...props}
      animate={{
        y: [-4 * intensity, 4 * intensity, -4 * intensity],
        rotate: [-0.5 * intensity, 0.5 * intensity, -0.5 * intensity],
      }}
      transition={{
        duration: 6 / intensity,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulsingGlow({ children, color = 'sunflower', intensity = 1, ...props }: {
  children: ReactNode;
  color?: 'sunflower' | 'orange' | 'emerald' | 'blue';
  intensity?: number;
  className?: string;
}) {
  const colorMap = {
    sunflower: 'rgba(244, 211, 94,',
    orange: 'rgba(224, 122, 61,',
    emerald: 'rgba(45, 106, 79,',
    blue: 'rgba(58, 123, 213,',
  };

  return (
    <motion.div
      {...props}
      style={{
        boxShadow: `0 0 ${20 * intensity}px -5px ${colorMap[color]} 0.4`,
      } as React.CSSProperties}
      animate={{
        boxShadow: [
          `0 0 ${15 * intensity}px -5px ${colorMap[color]} 0.3`,
          `0 0 ${30 * intensity}px -5px ${colorMap[color]} 0.5`,
          `0 0 ${15 * intensity}px -5px ${colorMap[color]} 0.3`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      {children}
    </motion.div>
  );
}