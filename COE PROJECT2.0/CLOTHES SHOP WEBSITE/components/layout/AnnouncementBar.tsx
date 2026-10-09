'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';
import { ANNOUNCEMENT_MESSAGES } from '@/lib/mock-data';

export function AnnouncementBar() {
  const { announcementIndex, setAnnouncementIndex } = useUIStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnnouncementIndex((announcementIndex + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [announcementIndex, setAnnouncementIndex]);

  const current = ANNOUNCEMENT_MESSAGES[announcementIndex];

  return (
    <div
      className="relative z-[100] flex h-10 items-center justify-center overflow-hidden bg-obsidian border-b border-champagne/10"
      role="region"
      aria-label="Announcements"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex items-center gap-2 text-center text-xs font-medium tracking-wide text-bone/80"
        >
          <span>{current.text}</span>
          {current.link && current.linkText && (
            <Link
              href={current.link}
              className="ml-1 font-semibold text-champagne underline underline-offset-2 hover:text-champagne-light transition-colors"
            >
              {current.linkText}
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute right-4 flex items-center gap-1">
        {ANNOUNCEMENT_MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setAnnouncementIndex(i)}
            aria-label={`Go to announcement ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === announcementIndex ? 'w-4 bg-champagne' : 'w-1 bg-bone/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
