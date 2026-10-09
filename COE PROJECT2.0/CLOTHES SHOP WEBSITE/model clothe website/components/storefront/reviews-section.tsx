"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import { REVIEWS } from "@/lib/mock-data";

export function ReviewsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-obsidian">
        <div className="mb-12 text-center md:mb-16">
          <div className="flex items-center justify-center gap-1 text-gold-champagne mb-4">
             {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <h2 className="section-heading mb-4 text-gradient-bone">Loved by Thousands</h2>
          <p className="body-text mx-auto max-w-2xl">
            Based on over 5,000+ verified customer reviews. Read what they have to say about the OBSIDIAN standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-obsidian p-6 flex flex-col h-full justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-champagne mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`h-3 w-3 ${idx < review.rating ? 'fill-current' : 'text-muted'}`} />
                  ))}
                </div>
                <h4 className="font-sans font-semibold mb-2 line-clamp-1">{review.title}</h4>
                <p className="font-sans text-sm text-muted-foreground mb-6 line-clamp-4 leading-relaxed">
                  "{review.body}"
                </p>
                
                {review.image && (
                  <div className="relative aspect-square w-20 mb-6 overflow-hidden rounded-sm border border-border">
                    <Image src={review.image} alt="Review image" fill className="object-cover" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                   <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium flex items-center gap-1">
                    {review.name} 
                    {review.isVerified && <CheckCircle2 className="h-3 w-3 text-gold-champagne" />}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
