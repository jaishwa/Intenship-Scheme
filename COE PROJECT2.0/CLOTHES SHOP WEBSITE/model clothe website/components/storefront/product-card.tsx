"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { type Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useUIStore } from "@/store/ui.store";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openModal } = useUIStore();

  const isWished = isInWishlist(product.id);
  const defaultVariant = product.variants[0];

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal("quick-view", { product });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, defaultVariant);
  };

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-product w-full overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {product.compareAtPrice && (
            <span className="bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive-foreground">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background ${isWished ? 'text-destructive' : 'text-foreground'}`}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWished ? 'fill-current' : ''}`} />
        </button>

        {/* Image Swap */}
        <Image
          src={product.images[0] || ""}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-500 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Quick View / Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button onClick={handleQuickView} className="btn-secondary w-full bg-background text-foreground hover:bg-foreground hover:text-background py-2 border-0">
            <Eye className="mr-2 h-4 w-4" /> Quick View
          </button>
          <button onClick={handleAddToCart} className="btn-primary w-full py-2">
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </button>
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-sans text-sm font-medium line-clamp-1">{product.name}</p>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            {product.availableColors.slice(0, 3).map((color, i) => (
              <div 
                key={i} 
                className={`h-3 w-3 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 ${i === 0 ? 'ring-1 ring-offset-1 ring-foreground' : ''}`}
                style={{ backgroundColor: i === 0 ? '#0A0A0B' : i === 1 ? '#FAFAF9' : '#1C1C1E' }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans text-sm">
          {product.compareAtPrice && (
            <span className="text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
          <span className={`${product.compareAtPrice ? 'text-destructive' : 'text-foreground'}`}>
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-gold-champagne">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-muted'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
