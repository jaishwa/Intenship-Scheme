import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CartItem, Product } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────── //

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Computed
  readonly totalItems: number;
  readonly subtotal: number;

  // Actions
  addItem: (product: Product, quantity?: number, variant?: CartItem["variant"]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────── //

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,

      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.variant?.size === variant?.size &&
              item.variant?.color === variant?.color,
          );

          if (existingIndex >= 0) {
            state.items[existingIndex]!.quantity += quantity;
          } else {
            const newItem: CartItem = {
              id: `${product.id}-${variant?.size ?? "default"}-${variant?.color ?? "default"}-${Date.now()}`,
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? "",
              quantity,
              variant,
            };
            state.items.push(newItem);
          }

          state.isOpen = true;
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          state.items = state.items.filter((item) => item.id !== itemId);
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            state.items = state.items.filter((item) => item.id !== itemId);
            return;
          }
          const item = state.items.find((i) => i.id === itemId);
          if (item) item.quantity = quantity;
        });
      },

      clearCart: () => {
        set((state) => {
          state.items = [];
        });
      },

      openCart: () => set((state) => { state.isOpen = true; }),
      closeCart: () => set((state) => { state.isOpen = false; }),
      toggleCart: () => set((state) => { state.isOpen = !state.isOpen; }),
    })),
    {
      name: "obsidian-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
