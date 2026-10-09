"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { BESTSELLERS } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const filteredProducts = BESTSELLERS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-modal bg-background/95 backdrop-blur-md"
        >
          <div className="container-obsidian h-full flex flex-col py-8 sm:py-16">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex flex-1 items-center gap-4">
                <Search className="h-6 w-6 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xl sm:text-3xl font-display outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={closeSearch}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close search"
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto no-scrollbar">
              {searchQuery.length === 0 ? (
                <div>
                  <h3 className="eyebrow mb-6 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Trending Now
                  </h3>
                  <div className="flex flex-wrap gap-3">
                     {["Oversized Tees", "Fleece Hoodies", "Cargo Pants", "NOIR Fragrance"].map(term => (
                       <button
                         key={term}
                         onClick={() => setSearchQuery(term)}
                         className="rounded-full border border-border px-4 py-2 font-sans text-sm hover:border-gold-champagne hover:text-gold-champagne transition-colors"
                       >
                         {term}
                       </button>
                     ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="eyebrow mb-6">Results for "{searchQuery}"</h3>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={closeSearch}
                          className="group"
                        >
                          <div className="relative aspect-product overflow-hidden bg-muted mb-3">
                            <Image
                              src={product.images[0] || ""}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-sans text-sm truncate">{product.name}</h4>
                          <p className="font-sans text-sm text-muted-foreground mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-xl text-muted-foreground">No products found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
