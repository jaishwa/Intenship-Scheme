'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/mock-data';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="hero-height relative flex items-end overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image
          src={HERO_IMAGES[0].src}
          alt={HERO_IMAGES[0].alt}
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-transparent" />
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute right-6 top-1/3 hidden lg:flex items-center gap-2 rounded-full border border-champagne/30 bg-obsidian/60 px-4 py-2 backdrop-blur-md"
      >
        <Sparkles size={12} className="text-champagne" />
        <span className="text-xs font-semibold uppercase tracking-widest text-champagne">
          New Collection
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        className="container-obsidian relative z-10 pb-16 lg:pb-24"
        style={{ opacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne"
        >
          SS&apos;25 Collection
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-6 font-serif font-light text-display-xl text-bone max-w-3xl"
        >
          Dressed in{' '}
          <em className="text-gradient-gold not-italic">Darkness,</em>
          <br />
          Defined by Detail.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8 max-w-md font-sans text-base text-bone/60 leading-relaxed"
        >
          Premium fashion for the discerning individual. Every piece engineered for
          those who refuse to settle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/shop" className="btn-primary group">
            Shop Now
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/collections/new-arrivals" className="btn-secondary">
            New Collection
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 flex items-center gap-8 border-t border-bone/10 pt-8"
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '4.8★', label: 'Average Rating' },
            { value: '100%', label: 'Premium Quality' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-2xl font-light text-champagne">{value}</p>
              <p className="text-xs text-bone/40 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-bone/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="h-6 w-px bg-gradient-to-b from-champagne/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
