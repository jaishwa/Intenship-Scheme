"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { type Product, type CartItemVariant } from "@/types";
import { formatPrice } from "@/lib/utils";

export function QuickViewModal() {
  const { activeModal, modalData, closeModal } = useUIStore();
  const isOpen = activeModal === "quick-view";
  const product = modalData.product as Product | undefined;

  const [selectedVariant, setSelectedVariant] = useState<CartItemVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (product) {
         setSelectedVariant(product.variants[0] || null);
         setActiveImage(0);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const isWished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, 1, selectedVariant || undefined);
    closeModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex w-full max-w-4xl flex-col md:flex-row overflow-hidden bg-card border border-border shadow-2xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/50 backdrop-blur-md text-foreground hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col bg-muted relative aspect-square md:aspect-auto">
             <div className="relative flex-1">
                <Image
                  src={product.images[activeImage] || product.images[0] || ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
             </div>
             {product.images.length > 1 && (
               <div className="flex gap-2 p-4 overflow-x-auto bg-background/50 backdrop-blur-sm absolute bottom-0 inset-x-0">
                 {product.images.map((img, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setActiveImage(idx)}
                     className={`relative h-16 w-12 flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-gold-champagne' : 'border-transparent hover:border-border'}`}
                   >
                     <Image src={img} alt="" fill className="object-cover" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto no-scrollbar">
             <div className="mb-2">
                <span className="eyebrow">{product.brand}</span>
             </div>
             <h2 className="font-display text-2xl sm:text-3xl mb-2">{product.name}</h2>
             
             <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 font-sans text-xl">
                  {product.compareAtPrice && (
                    <span className="text-muted-foreground line-through text-base">
                      {formatPrice(product.compareAtPrice, product.currency)}
                    </span>
                  )}
                  <span className={`${product.compareAtPrice ? 'text-destructive' : 'text-foreground'}`}>
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground border-l border-border pl-4">
                  <Star className="h-4 w-4 text-gold-champagne fill-current" />
                  <span>{product.rating} ({product.reviewCount})</span>
                </div>
             </div>

             <div className="divider mb-6" />

             <p className="body-text mb-8 text-sm">{product.description}</p>

             {/* Variants */}
             <div className="space-y-6 mb-8 flex-1">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-sm font-medium uppercase tracking-wider">Color: <span className="text-muted-foreground ml-1">{selectedVariant?.color}</span></span>
                  </div>
                  <div className="flex gap-3">
                    {product.availableColors.map((color, i) => (
                      <button 
                        key={color}
                        onClick={() => {
                          const v = product.variants.find(v => v.color === color && v.size === selectedVariant?.size) || product.variants.find(v => v.color === color);
                          if (v) setSelectedVariant(v);
                        }}
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedVariant?.color === color ? 'border-gold-champagne' : 'border-transparent'}`}
                        style={{ backgroundColor: i === 0 ? '#0A0A0B' : i === 1 ? '#FAFAF9' : i === 2 ? '#1B2A4A' : '#1C1C1E' }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-sm font-medium uppercase tracking-wider">Size: <span className="text-muted-foreground ml-1">{selectedVariant?.size}</span></span>
                    <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map(size => {
                      const isAvailable = product.variants.some(v => v.size === size && v.color === selectedVariant?.color && v.stock > 0);
                      return (
                        <button 
                          key={size}
                          disabled={!isAvailable}
                          onClick={() => {
                            const v = product.variants.find(v => v.size === size && v.color === selectedVariant?.color);
                            if (v) setSelectedVariant(v);
                          }}
                          className={`flex h-10 w-12 items-center justify-center border font-sans text-sm transition-all ${
                            !isAvailable ? 'opacity-30 cursor-not-allowed border-border line-through' :
                            selectedVariant?.size === size ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
             </div>

             {/* Actions */}
             <div className="flex gap-4 mt-auto pt-6 border-t border-border">
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-[56px] w-[56px] items-center justify-center border transition-colors ${isWished ? 'border-destructive text-destructive' : 'border-border text-foreground hover:border-foreground'}`}
                  aria-label="Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWished ? 'fill-current' : ''}`} />
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
