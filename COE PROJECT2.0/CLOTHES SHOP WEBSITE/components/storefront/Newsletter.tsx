'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function Newsletter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <section ref={ref} className="py-20 lg:py-28" aria-labelledby="newsletter-heading">
      <div className="container-obsidian">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-champagne/15 bg-gradient-to-br from-charcoal via-charcoal/80 to-obsidian p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-champagne/5 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-champagne/5 blur-3xl" />

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30"
                >
                  <CheckCircle2 size={32} className="text-green-400" />
                </motion.div>
                <h3 className="font-serif text-2xl text-bone">Welcome to the Inner Circle</h3>
                <p className="text-sm text-bone/50 max-w-sm">
                  You&apos;re in! Check your email for a welcome surprise — your exclusive 15% off code is waiting.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Sparkles size={14} className="text-champagne" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
                    Exclusive Access
                  </span>
                </div>

                <h2 id="newsletter-heading" className="mb-3 font-serif text-display-md text-bone">
                  Join the Inner Circle
                </h2>

                <p className="mb-8 text-sm text-bone/50 max-w-md mx-auto leading-relaxed">
                  Be the first to know about new drops, members-only deals, and styling tips.
                  Get <span className="text-champagne font-semibold">15% off</span> your first order.
                </p>

                <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        aria-label="Email address for newsletter"
                        className="w-full rounded-none border border-champagne/20 bg-obsidian/60 py-3.5 pl-11 pr-4 font-sans text-sm text-bone placeholder:text-bone/30 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary flex-shrink-0 disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="inline-block h-4 w-4 rounded-full border-2 border-obsidian border-t-transparent"
                          />
                          Joining...
                        </span>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] text-bone/30">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
