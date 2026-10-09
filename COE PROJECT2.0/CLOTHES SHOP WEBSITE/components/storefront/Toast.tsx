'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'border-green-500/30 bg-green-950/70 text-green-400',
  error: 'border-red-500/30 bg-red-950/70 text-red-400',
  info: 'border-champagne/30 bg-charcoal text-champagne',
};

export function Toast() {
  const { toast, hideToast } = useUIStore();

  return (
    <div
      className="fixed bottom-6 right-6 z-[100]"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-3 rounded-lg border px-5 py-3.5 shadow-card backdrop-blur-md ${colors[toast.type]}`}
          >
            {(() => {
              const Icon = icons[toast.type];
              return <Icon size={18} className="flex-shrink-0" />;
            })()}
            <span className="font-sans text-sm font-medium">{toast.message}</span>
            <button
              onClick={hideToast}
              className="ml-2 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
