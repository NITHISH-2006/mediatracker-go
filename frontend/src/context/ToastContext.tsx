import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from '../components/ui/Icon';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastType, { icon: IconName; ring: string; iconColor: string }> = {
  success: {
    icon: 'check-circle',
    ring: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: 'x-circle',
    ring: 'border-vermilion/50',
    iconColor: 'text-red-400',
  },
  info: {
    icon: 'sparkles',
    ring: 'border-sunflower/40',
    iconColor: 'text-sunflower',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (m) => toast('success', m),
      error: (m) => toast('error', m),
      info: (m) => toast('info', m),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)]">
        <AnimatePresence>
          {toasts.map((t) => {
            const style = TOAST_STYLES[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, rotate: 1.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 60, rotate: 1.5 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className={`vg-toast flex items-start gap-3 border ${style.ring}`}
                role="status"
              >
                <span className={`mt-0.5 shrink-0 ${style.iconColor}`}>
                  <Icon icon={style.icon} size={20} />
                </span>
                <p className="text-sm text-canvas leading-snug">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="ml-auto shrink-0 text-text-muted hover:text-canvas transition-colors"
                  aria-label="Dismiss notification"
                >
                  <Icon icon="close" size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}