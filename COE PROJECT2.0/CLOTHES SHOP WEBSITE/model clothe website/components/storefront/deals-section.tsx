"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { DEAL_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "./product-card";

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timer);
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="section-padding border-y border-border bg-charcoal">
      <div className="container-obsidian">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-16 md:flex-row">
          <div>
            <h2 className="section-heading mb-4 text-gradient-gold">Flash Deals</h2>
            <p className="body-text">Premium pieces at exceptional value.</p>
          </div>
          
          <div className="flex items-center gap-4 rounded-none border border-gold-champagne/30 bg-background/50 px-6 py-4 backdrop-blur-sm">
            <Clock className="h-5 w-5 text-gold-champagne" />
            <div className="flex items-center gap-2 font-display text-2xl tracking-widest text-gold-champagne">
              <span>{formatNumber(timeLeft.hours)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatNumber(timeLeft.minutes)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEAL_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
