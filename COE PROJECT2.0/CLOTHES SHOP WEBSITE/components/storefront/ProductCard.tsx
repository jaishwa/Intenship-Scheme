'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star, StarHalf } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useUIStore } from '@/store/ui-store';
import { formatPrice, getRatingStars, cn } from '@/lib/utils';
import type { Product, ProductSize } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { openQuickView, showToast } = useUIStore();

  const wishlisted = isWishlisted(product.id);
  const stars = getRatingStars(product.rating);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = selectedSize ?? product.sizes[Math.floor(product.sizes.length / 2)];
    addItem(product, size, selectedColor);
    setAddedToCart(true);
    showToast(`${product.name} added to cart!`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', wishlisted ? 'info' : 'success');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    openQuickView(product);
  };

  // Low stock threshold
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isLowStock = totalStock > 0 && totalStock <= 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="product-img-wrapper rounded-lg overflow-hidden">
          {/* Primary image */}
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority={priority}
            className={cn(
              'object-cover object-top transition-all duration-700',
              isHovered && product.hoverImage ? 'opacity-0' : 'opacity-100',
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Hover image */}
          {product.hoverImage && (
            <Image
              src={product.hoverImage.src}
              alt={product.hoverImage.alt}
              fill
              className={cn(
                'object-cover object-top transition-all duration-700',
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="badge bg-bone text-obsidian">New</span>
            )}
            {product.isBestseller && (
              <span className="badge bg-champagne text-obsidian">Bestseller</span>
            )}
            {product.discount > 0 && (
              <span className="badge bg-red-500/90 text-white">{product.discount}% off</span>
            )}
            {isLowStock && (
              <span className="badge bg-orange-500/90 text-white">Only {totalStock} left</span>
            )}
          </div>

          {/* Action buttons — appear on hover */}
          <div className={cn(
            'absolute right-3 top-3 z-10 flex flex-col gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
          )}>
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={wishlisted}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200',
                wishlisted
                  ? 'bg-champagne text-obsidian'
                  : 'bg-obsidian/70 text-bone hover:bg-champagne hover:text-obsidian',
              )}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-obsidian/70 text-bone backdrop-blur-md transition-all hover:bg-champagne hover:text-obsidian"
            >
              <Eye size={16} />
            </button>
          </div>

          {/* Add to Cart — slides up on hover */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 z-10 transition-all duration-300',
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
          )}>
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex w-full items-center justify-center gap-2 py-3.5 font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-200',
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-champagne text-obsidian hover:bg-champagne-light',
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={14} />
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-4 space-y-2 px-0.5">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={(e) => { e.preventDefault(); setSelectedColor(color.name); }}
                title={color.name}
                aria-label={`Color: ${color.name}`}
                aria-pressed={selectedColor === color.name}
                className={cn(
                  'h-3 w-3 rounded-full border transition-all duration-150',
                  selectedColor === color.name
                    ? 'border-champagne scale-125'
                    : 'border-transparent hover:scale-110',
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* Name */}
          <h3 className="font-sans text-sm font-medium text-bone/90 group-hover:text-bone transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex" aria-label={`Rating: ${product.rating} out of 5`} role="img">
              {stars.map((type, i) => (
                <span key={i}>
                  {type === 'full' && <Star size={11} className="text-champagne fill-champagne" />}
                  {type === 'half' && <StarHalf size={11} className="text-champagne fill-champagne" />}
                  {type === 'empty' && <Star size={11} className="text-bone/20" />}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-bone/40">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-semibold text-bone">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-bone/40 line-through">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-xs font-semibold text-green-400">
              {product.discount}% off
            </span>
          </div>

          {/* Size selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.map((size) => {
              const inStock = (product.stock[size] ?? 0) > 0;
              return (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); if (inStock) setSelectedSize(size); }}
                  disabled={!inStock}
                  aria-label={`Size ${size}${!inStock ? ' (out of stock)' : ''}`}
                  aria-pressed={selectedSize === size}
                  className={cn(
                    'rounded border px-2 py-0.5 text-[10px] font-medium transition-all duration-150',
                    selectedSize === size
                      ? 'border-champagne bg-champagne/10 text-champagne'
                      : inStock
                        ? 'border-bone/20 text-bone/50 hover:border-bone/50 hover:text-bone'
                        : 'border-bone/10 text-bone/20 cursor-not-allowed line-through',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
