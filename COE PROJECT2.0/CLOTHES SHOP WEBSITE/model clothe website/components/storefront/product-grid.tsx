"use client";

import { motion } from "framer-motion";
import { type Product } from "@/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
}

export function ProductGrid({ title, subtitle, products, actionLabel, actionHref }: ProductGridProps) {
  return (
    <section className="section-padding">
      <div className="container-obsidian">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-16 md:flex-row">
          <div>
            <h2 className="section-heading mb-2 text-gradient-bone">{title}</h2>
            {subtitle && <p className="body-text">{subtitle}</p>}
          </div>
          
          {actionLabel && actionHref && (
            <a href={actionHref} className="btn-secondary whitespace-nowrap">
              {actionLabel}
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
