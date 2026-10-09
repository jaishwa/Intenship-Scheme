"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { NAV_LINKS } from "@/lib/mock-data";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileNavOpen]);

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-drawer flex flex-col bg-background/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-xl text-gradient-bone">OBSIDIAN</h2>
            <button
              onClick={closeMobileNav}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-6">
              {NAV_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    onClick={closeMobileNav}
                    className="flex items-center justify-between py-2 text-xl font-display group"
                  >
                    <span className="group-hover:text-gold-champagne transition-colors">
                      {link.label}
                    </span>
                    {link.children && <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold-champagne transition-colors" />}
                  </Link>
                  {link.children && (
                    <ul className="mt-4 space-y-4 pl-4 border-l border-border">
                      {link.children.map((child, childIdx) => (
                        <li key={childIdx}>
                          <Link
                            href={child.href}
                            onClick={closeMobileNav}
                            className="block font-sans text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-border p-6 bg-card">
             <div className="grid grid-cols-2 gap-4">
               <Link href="/account" onClick={closeMobileNav} className="btn-secondary w-full">Account</Link>
               <Link href="/help" onClick={closeMobileNav} className="btn-secondary w-full">Support</Link>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
