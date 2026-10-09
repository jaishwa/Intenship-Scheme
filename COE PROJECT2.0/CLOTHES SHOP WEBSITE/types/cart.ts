import type { Product, ProductSize } from './product';

export interface CartItem {
  product: Product;
  size: ProductSize;
  color: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface CartSummary {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  savings: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
}
