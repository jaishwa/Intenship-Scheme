'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { TRENDING } from '@/lib/mock-data';
import { HERO_IMAGES } from '@/lib/mock-data';

export function TrendingCarousel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="py-20 lg:py-28 overflow-hidden" aria-labelledby="trending-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Trending Now</p>
            <h2 id="trending-heading" className="font-serif text-display-md text-bone">What&apos;s Hot</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/20 text-bone/60 transition-all hover:border-champagne hover:text-champagne"
              aria-label="Scroll carousel left"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/20 text-bone/60 transition-all hover:border-champagne hover:text-champagne"
              aria-label="Scroll carousel right"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          role="list"
          aria-label="Trending products carousel"
        >
          {[...TRENDING, ...TRENDING].map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              role="listitem"
              className="w-[240px] flex-shrink-0 sm:w-[280px] lg:w-[300px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Full-width lifestyle banner below carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-16 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        <div className="relative h-80 overflow-hidden rounded-2xl lg:h-[420px]">
          <Image
            src={HERO_IMAGES[1].src}
            alt="OBSIDIAN trending collection"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="pl-8 lg:pl-16">
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Limited Edition</p>
              <h3 className="mb-6 font-serif text-4xl font-light text-bone lg:text-6xl">
                The Dark<br />Edit &apos;25
              </h3>
              <Link href="/collections/trending" className="btn-primary">
                Explore Collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
