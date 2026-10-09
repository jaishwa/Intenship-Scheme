"use client";

import { useCartStore } from "@/store/cart.store";
import type { Product, CartItem } from "@/types";

/**
 * Cart hook — provides all cart actions and state.
 * Memoized selectors prevent unnecessary re-renders.
 */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  const isItemInCart = (productId: string, variant?: CartItem["variant"]) => {
    return items.some(
      (item) =>
        item.productId === productId &&
        (!variant ||
          (item.variant?.size === variant.size && item.variant?.color === variant.color)),
    );
  };

  const getItemQuantity = (productId: string) => {
    return items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    // State
    items,
    isOpen,
    totalItems,
    subtotal,
    isEmpty,

    // Computed
    isItemInCart,
    getItemQuantity,

    // Actions
    addItem: (product: Product, quantity?: number, variant?: CartItem["variant"]) =>
      addItem(product, quantity, variant),
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}
