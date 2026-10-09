"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RefreshCcw, Lock, Clock } from "lucide-react";

const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Premium Quality", desc: "Highest grade materials" },
  { icon: Truck, title: "Express Delivery", desc: "Free shipping over $200" },
  { icon: RefreshCcw, title: "30-Day Returns", desc: "Hassle-free exchanges" },
  { icon: Lock, title: "Secure Payment", desc: "256-bit encryption" },
  { icon: Clock, title: "24/7 Support", desc: "Dedicated customer care" },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container-obsidian">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:justify-between">
          {TRUST_POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 w-40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-gold-champagne transition-transform hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium uppercase tracking-wider">{point.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{point.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
