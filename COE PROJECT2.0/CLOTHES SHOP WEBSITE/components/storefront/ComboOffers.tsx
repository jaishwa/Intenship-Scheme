'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, ArrowRight, Gift, Truck, Layers } from 'lucide-react';
import { COMBO_OFFERS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

const comboIcons = {
  'buy-2': ShoppingBag,
  'buy-3': Truck,
  'mix-match': Layers,
};

const comboGradients = [
  'from-champagne/10 via-champagne/5 to-transparent',
  'from-blue-900/20 via-blue-900/5 to-transparent',
  'from-deep-gold/10 via-deep-gold/5 to-transparent',
];

export function ComboOffers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-charcoal/20" aria-labelledby="combo-heading">
      <div className="container-obsidian">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Save More</p>
          <h2 id="combo-heading" className="font-serif text-display-md text-bone">Combo Offers</h2>
          <p className="mt-3 text-sm text-bone/50">Stack your savings — the more you buy, the more you save.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {COMBO_OFFERS.map((combo, i) => {
            const Icon = comboIcons[combo.type];
            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <div className={`relative overflow-hidden rounded-2xl border border-champagne/10 bg-gradient-to-br ${comboGradients[i]} p-6 glass-card`}>
                  {/* Badge */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/10 border border-champagne/20">
                      <Icon size={20} className="text-champagne" />
                    </div>
                    <span className="badge bg-champagne text-obsidian text-[10px] px-3 py-1">
                      {combo.badge}
                    </span>
                  </div>

                  <h3 className="mb-2 font-serif text-2xl font-light text-bone">{combo.title}</h3>
                  <p className="mb-5 text-sm text-bone/50 leading-relaxed">{combo.description}</p>

                  {/* Product thumbnails */}
                  <div className="mb-5 flex -space-x-2">
                    {combo.products.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="relative h-12 w-10 overflow-hidden rounded border border-obsidian"
                      >
                        <Image
                          src={p.images[0].src}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ))}
                    {combo.products.length > 4 && (
                      <div className="flex h-12 w-10 items-center justify-center rounded border border-champagne/20 bg-charcoal text-xs text-bone/50">
                        +{combo.products.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Prices preview */}
                  <div className="mb-5 rounded-lg bg-obsidian/50 px-4 py-3">
                    <p className="text-xs text-bone/40 mb-1">Starting from</p>
                    <p className="font-sans text-lg font-semibold text-champagne">
                      {formatPrice(Math.min(...combo.products.map((p) => p.price)))}
                    </p>
                  </div>

                  <Link href={`/combos/${combo.id}`} className="btn-secondary w-full group">
                    Shop This Deal
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
