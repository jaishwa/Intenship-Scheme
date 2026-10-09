"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { UGC_POSTS } from "@/lib/mock-data";

export function UGCGallery() {
  return (
    <section className="section-padding bg-charcoal">
      <div className="container-obsidian">
        <div className="mb-12 flex flex-col items-center text-center">
          <Instagram className="h-8 w-8 text-gold-champagne mb-4" />
          <h2 className="section-heading mb-4 text-gradient-bone">Join the Movement</h2>
          <p className="body-text max-w-xl">
            Tag @obsidianfashion or use #OBSIDIANDARK to be featured on our gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {UGC_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-square w-full overflow-hidden bg-muted cursor-pointer"
            >
              <Image 
                src={post.image} 
                alt="UGC post" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center text-white">
                <Heart className="h-6 w-6 fill-current text-white mb-2" />
                <span className="font-sans font-medium">{post.likes}</span>
                <span className="font-sans text-xs mt-2 text-white/80">{post.handle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
