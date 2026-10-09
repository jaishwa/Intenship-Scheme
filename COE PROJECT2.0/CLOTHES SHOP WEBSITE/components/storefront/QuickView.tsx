'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, ShoppingBag, Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { formatPrice, getRatingStars, cn } from '@/lib/utils';
import type { ProductSize } from '@/types';

export function QuickViewModal() {
  const { activeModal, quickViewProduct, closeQuickView, showToast } = useUIStore();
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = quickViewProduct;
  const isOpen = activeModal === 'quickview' && !!product;

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const stars = getRatingStars(product.rating);

  const handleAddToCart = () => {
    const size = selectedSize ?? product.sizes[Math.floor(product.sizes.length / 2)];
    addItem(product, size, product.colors[selectedColor].name, quantity);
    showToast(`${product.name} added to cart!`);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-obsidian/80 backdrop-blur-sm"
            onClick={closeQuickView}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-4 z-[75] m-auto flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border border-champagne/10 bg-charcoal shadow-card-hover lg:flex-row"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
          >
            {/* Close button */}
            <button
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-obsidian/70 text-bone/70 backdrop-blur-md transition-colors hover:text-bone"
              aria-label="Close quick view"
            >
              <X size={18} />
            </button>

            {/* Image gallery */}
            <div className="relative flex aspect-square flex-shrink-0 bg-charcoal-dark lg:w-[45%]">
              <Image
                src={product.images[currentImage]?.src ?? product.images[0].src}
                alt={product.images[currentImage]?.alt ?? product.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              {/* Image nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p === 0 ? product.images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/60 text-bone/70 backdrop-blur-md hover:text-bone transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p === product.images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/60 text-bone/70 backdrop-blur-md hover:text-bone transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Image dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      currentImage === i ? 'w-6 bg-champagne' : 'w-1.5 bg-bone/30',
                    )}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {product.isNew && <span className="badge bg-bone text-obsidian">New</span>}
                {product.isBestseller && <span className="badge bg-champagne text-obsidian">Bestseller</span>}
                {product.discount > 0 && <span className="badge bg-red-500/90 text-white">{product.discount}% off</span>}
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 lg:p-8">
              {/* Brand & Name */}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                {product.brand}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-light text-bone lg:text-3xl">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {stars.map((type, i) => (
                    <span key={i}>
                      {type === 'full' && <Star size={13} className="fill-champagne text-champagne" />}
                      {type === 'half' && <StarHalf size={13} className="fill-champagne text-champagne" />}
                      {type === 'empty' && <Star size={13} className="text-bone/20" />}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-bone/50">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-sans text-2xl font-semibold text-bone">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-bone/40 line-through">{formatPrice(product.mrp)}</span>
                <span className="badge bg-green-500/20 text-green-400">{product.discount}% off</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-bone/60">
                {product.description}
              </p>

              <div className="divider-gold my-5" />

              {/* Color selector */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone/50">
                  Color: <span className="text-bone">{product.colors[selectedColor].name}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      aria-label={`Color: ${color.name}`}
                      aria-pressed={selectedColor === i}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-all duration-200',
                        selectedColor === i
                          ? 'border-champagne scale-110 shadow-gold'
                          : 'border-transparent hover:border-bone/30',
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone/50">
                  Size: <span className="text-bone">{selectedSize ?? 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const inStock = (product.stock[size] ?? 0) > 0;
                    return (
                      <button
                        key={size}
                        onClick={() => inStock && setSelectedSize(size)}
                        disabled={!inStock}
                        aria-label={`Size ${size}${!inStock ? ' — out of stock' : ''}`}
                        aria-pressed={selectedSize === size}
                        className={cn(
                          'flex h-10 min-w-[2.5rem] items-center justify-center rounded border px-3 text-sm font-medium transition-all duration-200',
                          selectedSize === size
                            ? 'border-champagne bg-champagne/10 text-champagne'
                            : inStock
                              ? 'border-bone/20 text-bone/60 hover:border-champagne/50 hover:text-bone'
                              : 'border-bone/10 text-bone/15 cursor-not-allowed line-through',
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone/50">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded border border-bone/20 text-bone/60 hover:border-champagne hover:text-bone transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-bone">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded border border-bone/20 text-bone/60 hover:border-champagne hover:text-bone transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1"
                >
                  <ShoppingBag size={16} />
                  Add to Cart — {formatPrice(product.price * quantity)}
                </button>
                <button
                  onClick={() => {
                    toggleItem(product);
                    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥');
                  }}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-none border px-4 py-3.5 font-sans text-sm font-semibold transition-all',
                    wishlisted
                      ? 'border-champagne bg-champagne/10 text-champagne'
                      : 'border-bone/20 text-bone/60 hover:border-champagne hover:text-champagne',
                  )}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
