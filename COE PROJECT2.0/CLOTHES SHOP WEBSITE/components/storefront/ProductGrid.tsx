'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  title: string;
  subtitle?: string;
  label?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  title,
  subtitle,
  label,
  products,
  viewAllHref,
  viewAllLabel = 'View All',
  columns = 4,
}: ProductGridProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const colClasses = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <section ref={ref} className="py-20 lg:py-28" aria-labelledby={`grid-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            {label && (
              <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
                {label}
              </p>
            )}
            <h2
              id={`grid-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}
              className="font-serif text-display-md text-bone"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-bone/50">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group flex items-center gap-2 text-sm text-bone/50 hover:text-champagne transition-colors flex-shrink-0"
            >
              {viewAllLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>

        {/* Grid */}
        <div className={`grid ${colClasses} gap-x-4 gap-y-10 lg:gap-x-6`}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
