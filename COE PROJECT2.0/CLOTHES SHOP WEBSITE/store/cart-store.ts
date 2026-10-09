import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartSummary } from '@/types';
import type { Product, ProductSize } from '@/types/product';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

function computeSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.mrp * item.quantity,
    0,
  );
  const discountAmount = items.reduce(
    (sum, item) =>
      sum + (item.product.mrp - item.product.price) * item.quantity,
    0,
  );
  const discountedSubtotal = subtotal - discountAmount;
  const shippingCost =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = discountedSubtotal + shippingCost;
  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal,
  );

  return {
    subtotal,
    discountAmount,
    shippingCost,
    total,
    savings: discountAmount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Computed
  itemCount: number;
  summary: CartSummary;

  // Actions
  addItem: (product: Product, size: ProductSize, color: string, qty?: number) => void;
  removeItem: (productId: string, size: ProductSize, color: string) => void;
  updateQuantity: (productId: string, size: ProductSize, color: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      itemCount: 0,
      summary: computeSummary([]),

      addItem: (product, size, color, qty = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color,
        );

        let newItems: CartItem[];
        if (existing) {
          newItems = items.map((i) =>
            i.product.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + qty }
              : i,
          );
        } else {
          newItems = [
            ...items,
            { product, size, color, quantity: qty, addedAt: new Date().toISOString() },
          ];
        }

        set({
          items: newItems,
          itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
          summary: computeSummary(newItems),
          isOpen: true,
        });
      },

      removeItem: (productId, size, color) => {
        const newItems = get().items.filter(
          (i) =>
            !(i.product.id === productId && i.size === size && i.color === color),
        );
        set({
          items: newItems,
          itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
          summary: computeSummary(newItems),
        });
      },

      updateQuantity: (productId, size, color, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        const newItems = get().items.map((i) =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity: qty }
            : i,
        );
        set({
          items: newItems,
          itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
          summary: computeSummary(newItems),
        });
      },

      clearCart: () =>
        set({ items: [], itemCount: 0, summary: computeSummary([]) }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'obsidian-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
          state.summary = computeSummary(state.items);
        }
      },
    },
  ),
);
