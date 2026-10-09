"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/mock-data";

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isVisible = useUIStore((s) => s.isAnnouncementVisible);
  const dismiss = useUIStore((s) => s.dismissAnnouncement);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative flex items-center justify-center bg-obsidian px-12 py-2.5 text-center sm:px-16 border-b border-border/10">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="font-sans text-xs font-medium tracking-[0.1em] text-bone-200"
        >
          {ANNOUNCEMENT_MESSAGES[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-bone-400 hover:text-bone transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
