'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Truck, RotateCcw, Lock, Headphones } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'Premium Quality',
    description: '100% premium fabrics. Every piece quality-checked before dispatch.',
    color: 'text-champagne',
    bgColor: 'bg-champagne/10',
    borderColor: 'border-champagne/20',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'PAN India delivery in 3–5 days. Free shipping on orders above ₹999.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Not happy? Return within 7 days, no questions asked.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: 'Bank-grade encryption. UPI, Cards, COD — all payment modes accepted.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Dedicated support team available 9 AM – 9 PM, 7 days a week.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
  },
];

export function TrustBadges() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28" aria-labelledby="trust-heading">
      <div className="container-obsidian">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
            The OBSIDIAN Promise
          </p>
          <h2 id="trust-heading" className="font-serif text-display-md text-bone">
            Why Choose Us
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col items-center rounded-2xl border ${item.borderColor} bg-charcoal/40 p-6 text-center backdrop-blur-sm transition-shadow hover:shadow-card-hover`}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.bgColor} border ${item.borderColor}`}>
                  <Icon size={22} className={item.color} />
                </div>
                <h3 className="mb-2 font-sans text-sm font-semibold text-bone">{item.title}</h3>
                <p className="text-xs leading-relaxed text-bone/50">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
