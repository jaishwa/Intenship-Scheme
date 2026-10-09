"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1612461019183-b7e6ab232230?w=2000&q=80"
          alt="OBSIDIAN New Collection"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-vignette" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center text-center"
      >
        <div className="container-obsidian flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="eyebrow mb-6 text-bone-200"
          >
            The New Standard
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="display-heading mb-8 max-w-4xl text-bone"
          >
            Refined Basics for the Modern Wardrobe
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/collections/new-in" className="btn-secondary bg-transparent text-bone border-bone-400 hover:bg-bone hover:text-obsidian">
              New Collection
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
