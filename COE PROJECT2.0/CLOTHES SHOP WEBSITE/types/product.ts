export type ProductCategory =
  | 'oversized-tees'
  | 'shirts'
  | 'hoodies'
  | 'track-pants'
  | 'cargo-pants'
  | 'jeans'
  | 'shorts'
  | 'fragrance'
  | 'accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  mediaUrls?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  mrp: number;
  discount: number; // percentage
  images: ProductImage[];
  hoverImage?: ProductImage;
  colors: ProductColor[];
  sizes: ProductSize[];
  stock: Record<string, number>; // size -> quantity
  tags: string[];
  isNew: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  sku: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  colors?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'discount';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ComboOffer {
  id: string;
  title: string;
  description: string;
  type: 'buy-2' | 'buy-3' | 'mix-match';
  discount: number;
  products: Product[];
  badge: string;
}
