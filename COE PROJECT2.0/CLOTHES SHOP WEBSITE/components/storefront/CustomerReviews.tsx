'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/lib/mock-data';
import { getRatingStars } from '@/lib/utils';

const AGGREGATE = {
  average: 4.8,
  total: 10247,
  distribution: { 5: 78, 4: 15, 3: 5, 2: 1, 1: 1 },
};

export function CustomerReviews() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-charcoal/20" aria-labelledby="reviews-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Social Proof</p>
          <h2 id="reviews-heading" className="font-serif text-display-md text-bone">What Our Customers Say</h2>
        </motion.div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-12 flex flex-col items-center gap-8 rounded-2xl border border-champagne/10 bg-charcoal/50 p-8 sm:flex-row sm:justify-center lg:px-16"
        >
          {/* Score */}
          <div className="flex flex-col items-center">
            <p className="font-serif text-7xl font-light text-champagne">{AGGREGATE.average}</p>
            <div className="mt-2 flex gap-0.5" aria-label={`${AGGREGATE.average} out of 5 stars`}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={18} className={s <= Math.round(AGGREGATE.average) ? 'fill-champagne text-champagne' : 'text-bone/20'} />
              ))}
            </div>
            <p className="mt-1 text-sm text-bone/40">{AGGREGATE.total.toLocaleString('en-IN')} reviews</p>
          </div>

          {/* Divider */}
          <div className="hidden h-24 w-px bg-champagne/10 sm:block" />

          {/* Distribution */}
          <div className="w-full max-w-xs space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-4 text-xs text-bone/50 text-right">{star}</span>
                <Star size={10} className="text-champagne fill-champagne flex-shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-obsidian overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${AGGREGATE.distribution[star]}%` } : {}}
                    transition={{ delay: 0.3 + (5 - star) * 0.08, duration: 0.8 }}
                    className="h-full rounded-full bg-champagne"
                  />
                </div>
                <span className="w-8 text-xs text-bone/40">{AGGREGATE.distribution[star]}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Review cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_REVIEWS.map((review, i) => {
            const stars = getRatingStars(review.rating);
            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 + 0.2 }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              >
                {/* Quote icon */}
                <Quote size={20} className="text-champagne/30" />

                {/* Stars */}
                <div className="flex gap-0.5" aria-label={`${review.rating} stars`}>
                  {stars.map((type, j) => (
                    <Star key={j} size={13} className={type !== 'empty' ? 'fill-champagne text-champagne' : 'text-bone/20'} />
                  ))}
                </div>

                {/* Content */}
                <p className="flex-1 text-sm leading-relaxed text-bone/70 line-clamp-3">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-champagne/10 pt-4">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full bg-charcoal flex-shrink-0">
                    <Image
                      src={review.avatar ?? ''}
                      alt={review.author}
                      fill className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-bone">{review.author}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {review.verified && (
                        <>
                          <CheckCircle2 size={11} className="text-green-400" />
                          <span className="text-[10px] text-green-400">Verified Purchase</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
