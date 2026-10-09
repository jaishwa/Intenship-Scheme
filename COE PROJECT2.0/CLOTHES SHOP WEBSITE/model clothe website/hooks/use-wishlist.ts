"use client";

import { useWishlistStore } from "@/store/wishlist.store";
import type { Product } from "@/types";

/**
 * Wishlist hook — provides all wishlist actions and state.
 */
export function useWishlist() {
  const items = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const totalItems = items.length;
  const isEmpty = items.length === 0;

  return {
    // State
    items,
    totalItems,
    isEmpty,

    // Actions
    addToWishlist: (product: Product) => addToWishlist(product),
    removeFromWishlist,
    toggleWishlist: (product: Product) => toggleWishlist(product),
    isInWishlist,
    clearWishlist,
  };
}
