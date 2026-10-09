'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { BESTSELLERS } from '@/lib/mock-data';
import { formatCountdown } from '@/lib/utils';

// Deals end in 6 hours from mount
const DEAL_DURATION_SECONDS = 6 * 60 * 60;

export function TodaysDeals() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [secondsLeft, setSecondsLeft] = useState(DEAL_DURATION_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, secs } = formatCountdown(secondsLeft);
  const dealProducts = BESTSELLERS.slice(0, 4).map((p) => ({
    ...p,
    price: Math.round(p.price * 0.9), // extra 10% off for deals
    discount: Math.round(p.discount + 10),
  }));

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-charcoal/30" aria-labelledby="deals-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/10 border border-champagne/30">
              <Zap size={18} className="text-champagne" />
            </div>
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
                Limited Time
              </p>
              <h2 id="deals-heading" className="font-serif text-display-md text-bone">
                Today&apos;s Deals
              </h2>
            </div>
          </div>

          {/* Countdown timer */}
          <div
            className="flex items-center gap-3"
            aria-label={`Deal ends in ${hours} hours, ${minutes} minutes, and ${secs} seconds`}
          >
            <div className="flex items-center gap-1 text-bone/50 text-sm">
              <Clock size={14} />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { value: hours, label: 'hr' },
                { value: minutes, label: 'min' },
                { value: secs, label: 'sec' },
              ].map(({ value, label }, i) => (
                <span key={label} className="flex items-center gap-1">
                  <motion.span
                    key={value}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    className="inline-flex min-w-[2.5rem] items-center justify-center rounded bg-obsidian px-2 py-1.5 font-mono text-lg font-bold text-champagne shadow-inner-gold"
                  >
                    {value}
                  </motion.span>
                  <span className="text-xs text-bone/40">{label}</span>
                  {i < 2 && <span className="text-champagne font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Deal products */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <Link href="/deals" className="btn-secondary group">
            View All Deals
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
