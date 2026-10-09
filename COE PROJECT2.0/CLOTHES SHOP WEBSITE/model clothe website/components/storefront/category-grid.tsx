"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function CategoryGrid() {
  return (
    <section className="section-padding bg-background">
      <div className="container-obsidian">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="section-heading mb-4 text-gradient-bone">Shop by Category</h2>
          <div className="gold-rule mx-auto" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CATEGORIES.map((category, index) => {
            const isFeatured = index === 0; // Make first item span larger if needed
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className={`group relative overflow-hidden bg-muted ${
                  isFeatured ? "aspect-[3/4] sm:col-span-2 sm:row-span-2 lg:col-span-1" : "aspect-[3/4]"
                }`}
              >
                <Link href={`/shop/${category.slug}`} className="block h-full w-full">
                  <Image
                    src={category.image?.url ?? ""}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="font-display text-2xl text-white md:text-3xl lg:text-4xl">
                      {category.name}
                    </h3>
                    <div className="mt-4 h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100">
                      <span className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-gold-champagne">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
