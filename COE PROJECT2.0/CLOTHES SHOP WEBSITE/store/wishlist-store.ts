import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  itemCount: number;
  isOpen: boolean;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      isOpen: false,

      addItem: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) return;
        const newItems = [...get().items, product];
        set({ items: newItems, itemCount: newItems.length });
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.id !== productId);
        set({ items: newItems, itemCount: newItems.length });
      },

      toggleItem: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (productId) => get().items.some((i) => i.id === productId),

      clearWishlist: () => set({ items: [], itemCount: 0 }),

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'obsidian-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.itemCount = state.items.length;
        }
      },
    },
  ),
);
