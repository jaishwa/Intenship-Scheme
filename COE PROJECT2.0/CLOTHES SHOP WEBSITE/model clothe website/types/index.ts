// =============================================================================
// OBSIDIAN — Domain Types
// =============================================================================

// ── Common ────────────────────────────────────────────────────────────────── //

export interface Image {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: Image;
}

export type Currency = "USD" | "EUR" | "GBP";

export type Locale = "en-US" | "en-GB" | "fr-FR";

// ── Product ───────────────────────────────────────────────────────────────── //

export type ProductStatus = "active" | "archived" | "draft";
export type ProductGender = "men" | "women" | "unisex";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  sku: string;
  stock: number;
  price?: number; // Override base price if different
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  shortDescription?: string;

  price: number;
  compareAtPrice?: number; // For showing strikethrough / sale
  currency: Currency;

  images: string[];        // First image is the primary/cover image
  imageObjects?: Image[];  // Rich image objects with alt text

  category: Category;
  tags: string[];
  gender: ProductGender;
  material?: string;
  careInstructions?: string[];

  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: string[];

  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;

  rating: number;        // 0–5
  reviewCount: number;

  seo?: SeoMeta;
  createdAt: string;     // ISO date
  updatedAt: string;     // ISO date
}

// ── Category ──────────────────────────────────────────────────────────────── //

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: Image;
  parentId?: string;
  sortOrder?: number;
}

// ── Cart ──────────────────────────────────────────────────────────────────── //

export interface CartItemVariant {
  size: string;
  color: string;
  colorHex?: string;
  sku?: string;
}

export interface CartItem {
  id: string;              // Unique cart line item ID
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  variant?: CartItemVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  couponCode?: string;
}

// ── Wishlist ──────────────────────────────────────────────────────────────── //

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  addedAt: string;
}

// ── User & Auth ───────────────────────────────────────────────────────────── //

export type UserRole = "customer" | "admin" | "moderator";

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

// ── Orders ────────────────────────────────────────────────────────────────── //

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  variant?: CartItemVariant;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Review ────────────────────────────────────────────────────────────────── //

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;      // 1–5
  title?: string;
  body: string;
  images?: Image[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ── Navigation ────────────────────────────────────────────────────────────── //

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
  badge?: string;
  isExternal?: boolean;
}

// ── API Responses ─────────────────────────────────────────────────────────── //

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// ── Filters ───────────────────────────────────────────────────────────────── //

export interface ProductFilters {
  category?: string;
  gender?: ProductGender;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  sort?: "price-asc" | "price-desc" | "newest" | "popular" | "rating";
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
}
