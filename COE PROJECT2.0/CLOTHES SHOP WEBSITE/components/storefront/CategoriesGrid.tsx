'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/mock-data';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function CategoriesGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28" aria-labelledby="categories-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
              Explore
            </p>
            <h2 id="categories-heading" className="font-serif text-display-md text-bone">
              Shop by Category
            </h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-sm text-bone/50 hover:text-champagne transition-colors">
            View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id} variants={item}>
              <Link
                href={cat.href}
                className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-lg bg-charcoal"
                aria-label={`Browse ${cat.label} — ${cat.count} products`}
              >
                {/* Image */}
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent transition-opacity duration-300 group-hover:from-obsidian/70" />

                {/* Reveal overlay on hover */}
                <div className="absolute inset-0 bg-champagne/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-sans text-sm font-semibold text-bone transition-colors group-hover:text-champagne">
                    {cat.label}
                  </p>
                  <div className="mt-1 flex items-center gap-1 overflow-hidden">
                    <p className="translate-y-4 text-xs text-bone/50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {cat.count} items
                    </p>
                    <ArrowRight
                      size={12}
                      className="translate-y-4 text-champagne opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </div>
                </div>

                {/* NEW badge on first few */}
                {i < 2 && (
                  <div className="absolute left-3 top-3 badge bg-champagne text-obsidian text-[9px]">
                    New
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
