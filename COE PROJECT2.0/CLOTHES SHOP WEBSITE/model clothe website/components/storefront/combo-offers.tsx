"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const OFFERS = [
  {
    title: "Buy 2, Save 15%",
    description: "Mix and match any essentials.",
    code: "ESSENTIAL15",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    color: "bg-obsidian-900"
  },
  {
    title: "Free Shipping",
    description: "On all orders over $200.",
    code: "AUTO-APPLIED",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    color: "bg-charcoal"
  }
];

export function ComboOffers() {
  return (
    <section className="section-padding-sm border-t border-border">
      <div className="container-obsidian">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFERS.map((offer, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`group relative overflow-hidden aspect-[2/1] ${offer.color} p-8 sm:p-12 flex flex-col justify-center`}
            >
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60">
                <Image 
                  src={offer.image} 
                  alt={offer.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-3xl sm:text-4xl text-bone mb-2">{offer.title}</h3>
                <p className="text-bone-400 mb-6">{offer.description}</p>
                <div className="inline-flex items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest bg-white/10 px-3 py-1 text-white border border-white/20 backdrop-blur-sm rounded-sm">
                    {offer.code}
                  </span>
                  <button className="text-white hover:text-gold-champagne transition-colors group-hover:translate-x-1">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
