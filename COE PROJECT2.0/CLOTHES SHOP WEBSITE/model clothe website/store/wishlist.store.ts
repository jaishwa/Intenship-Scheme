import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Product } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────── //

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];

  // Computed
  readonly totalItems: number;

  // Actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────── //

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],

      get totalItems() {
        return get().items.length;
      },

      addToWishlist: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.productId === product.id);
          if (!exists) {
            state.items.push({
              id: `wishlist-${product.id}-${Date.now()}`,
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? "",
              slug: product.slug,
              addedAt: new Date().toISOString(),
            });
          }
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => {
          state.items = state.items.filter((item) => item.productId !== productId);
        });
      },

      toggleWishlist: (product) => {
        const isIn = get().isInWishlist(product.id);
        if (isIn) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        set((state) => {
          state.items = [];
        });
      },
    })),
    {
      name: "obsidian-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
