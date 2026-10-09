'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { UGC_GALLERY } from '@/lib/mock-data';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
};

export function UGCGallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28" aria-labelledby="ugc-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Instagram size={16} className="text-champagne" />
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
              @obsidianstore
            </p>
          </div>
          <h2 id="ugc-heading" className="font-serif text-display-md text-bone">
            Styled by You
          </h2>
          <p className="mt-3 text-sm text-bone/50">
            Tag us in your OBSIDIAN fits and get featured.
          </p>
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 lg:gap-3"
        >
          {UGC_GALLERY.map((src, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative aspect-square overflow-hidden rounded-lg bg-charcoal cursor-pointer"
            >
              <Image
                src={src}
                alt={`Customer photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 11vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram size={22} className="text-bone" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <a
            href="https://instagram.com/obsidianstore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex"
          >
            <Instagram size={16} />
            Follow Us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
