import type { Product, Category } from "@/types";

// ── Categories ─────────────────────────────────────────────────────────────── //

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "oversized-tees",
    name: "Oversized Tees",
    description: "Relaxed silhouettes, premium cotton blends",
    image: {
      url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      alt: "Oversized Tees",
    },
    sortOrder: 1,
  },
  {
    id: "cat-2",
    slug: "shirts",
    name: "Shirts",
    description: "Elevated everyday shirting",
    image: {
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
      alt: "Shirts",
    },
    sortOrder: 2,
  },
  {
    id: "cat-3",
    slug: "hoodies",
    name: "Hoodies",
    description: "Heavyweight comfort, refined design",
    image: {
      url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
      alt: "Hoodies",
    },
    sortOrder: 3,
  },
  {
    id: "cat-4",
    slug: "track-pants",
    name: "Track Pants",
    description: "Athletic precision, elevated aesthetic",
    image: {
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      alt: "Track Pants",
    },
    sortOrder: 4,
  },
  {
    id: "cat-5",
    slug: "cargo-pants",
    name: "Cargo Pants",
    description: "Utility meets luxury",
    image: {
      url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      alt: "Cargo Pants",
    },
    sortOrder: 5,
  },
  {
    id: "cat-6",
    slug: "jeans",
    name: "Jeans",
    description: "Premium denim, artisanal wash",
    image: {
      url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
      alt: "Jeans",
    },
    sortOrder: 6,
  },
  {
    id: "cat-7",
    slug: "shorts",
    name: "Shorts",
    description: "Warm-weather refined essentials",
    image: {
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      alt: "Shorts",
    },
    sortOrder: 7,
  },
  {
    id: "cat-8",
    slug: "fragrance",
    name: "Fragrance",
    description: "Signature scents, obsidian-curated",
    image: {
      url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
      alt: "Fragrance",
    },
    sortOrder: 8,
  },
  {
    id: "cat-9",
    slug: "accessories",
    name: "Accessories",
    description: "The finishing touch",
    image: {
      url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
      alt: "Accessories",
    },
    sortOrder: 9,
  },
];

// ── Products ───────────────────────────────────────────────────────────────── //

export const BESTSELLERS: Product[] = [
  {
    id: "prod-1",
    slug: "obsidian-classic-tee-black",
    name: "Classic Obsidian Tee",
    brand: "OBSIDIAN",
    description: "Our signature oversized tee crafted from 320gsm heavyweight cotton. A wardrobe cornerstone.",
    price: 1299,
    compareAtPrice: 1999,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    category: CATEGORIES[0]!,
    tags: ["bestseller", "essential", "black"],
    gender: "unisex",
    material: "320gsm heavyweight cotton",
    variants: [
      { id: "v1-s", size: "S", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-TEE-BLK-S", stock: 12 },
      { id: "v1-m", size: "M", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-TEE-BLK-M", stock: 8 },
      { id: "v1-l", size: "L", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-TEE-BLK-L", stock: 15 },
      { id: "v1-xl", size: "XL", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-TEE-BLK-XL", stock: 5 },
      { id: "v1-s-w", size: "S", color: "Bone White", colorHex: "#FAFAF9", sku: "OBS-TEE-WHT-S", stock: 10 },
      { id: "v1-m-w", size: "M", color: "Bone White", colorHex: "#FAFAF9", sku: "OBS-TEE-WHT-M", stock: 7 },
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Obsidian Black", "Bone White"],
    status: "active",
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 342,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "prod-2",
    slug: "obsidian-fleece-hoodie",
    name: "Fleece Arch Hoodie",
    brand: "OBSIDIAN",
    description: "500gsm brushed fleece hoodie with embroidered arch logo. Drop shoulder cut.",
    price: 2499,
    compareAtPrice: 3499,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
      "https://images.unsplash.com/photo-1631217869547-e7e52e0e6f91?w=800&q=80",
    ],
    category: CATEGORIES[2]!,
    tags: ["bestseller", "hoodie", "fleece"],
    gender: "unisex",
    material: "500gsm brushed fleece",
    variants: [
      { id: "v2-s", size: "S", color: "Charcoal", colorHex: "#1C1C1E", sku: "OBS-HOD-CHR-S", stock: 6 },
      { id: "v2-m", size: "M", color: "Charcoal", colorHex: "#1C1C1E", sku: "OBS-HOD-CHR-M", stock: 4 },
      { id: "v2-l", size: "L", color: "Charcoal", colorHex: "#1C1C1E", sku: "OBS-HOD-CHR-L", stock: 9 },
      { id: "v2-s-b", size: "S", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-HOD-BLK-S", stock: 3 },
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Charcoal", "Obsidian Black"],
    status: "active",
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 218,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "prod-3",
    slug: "obsidian-cargo-pant-sand",
    name: "Tactical Cargo Pant",
    brand: "OBSIDIAN",
    description: "6-pocket cargo silhouette in military-grade ripstop fabric. Articulated knees.",
    price: 2999,
    compareAtPrice: 3999,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    ],
    category: CATEGORIES[4]!,
    tags: ["bestseller", "cargo", "pants"],
    gender: "men",
    material: "Ripstop cotton blend",
    variants: [
      { id: "v3-30", size: "30", color: "Sand", colorHex: "#C4A882", sku: "OBS-CGO-SND-30", stock: 8 },
      { id: "v3-32", size: "32", color: "Sand", colorHex: "#C4A882", sku: "OBS-CGO-SND-32", stock: 12 },
      { id: "v3-34", size: "34", color: "Sand", colorHex: "#C4A882", sku: "OBS-CGO-SND-34", stock: 5 },
      { id: "v3-30-b", size: "30", color: "Obsidian Black", colorHex: "#0A0A0B", sku: "OBS-CGO-BLK-30", stock: 2 },
    ],
    availableSizes: ["30", "32", "34", "36"],
    availableColors: ["Sand", "Obsidian Black"],
    status: "active",
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 156,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "prod-4",
    slug: "obsidian-oxford-shirt",
    name: "Oxford Club Shirt",
    brand: "OBSIDIAN",
    description: "Relaxed-fit Oxford button-down in premium 140-thread-count cotton.",
    price: 1799,
    compareAtPrice: 2499,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    ],
    category: CATEGORIES[1]!,
    tags: ["bestseller", "shirt", "oxford"],
    gender: "men",
    material: "140tc Oxford cotton",
    variants: [
      { id: "v4-s", size: "S", color: "Bone White", colorHex: "#FAFAF9", sku: "OBS-OXF-WHT-S", stock: 14 },
      { id: "v4-m", size: "M", color: "Bone White", colorHex: "#FAFAF9", sku: "OBS-OXF-WHT-M", stock: 10 },
      { id: "v4-l", size: "L", color: "Bone White", colorHex: "#FAFAF9", sku: "OBS-OXF-WHT-L", stock: 7 },
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Bone White", "Slate Blue"],
    status: "active",
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 89,
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  },
];

export const NEW_ARRIVALS: Product[] = [
  {
    id: "prod-5",
    slug: "obsidian-track-pant-jet",
    name: "Velocity Track Pant",
    brand: "OBSIDIAN",
    description: "Performance-woven track pant with gold-zip detail. Tapered silhouette.",
    price: 1999,
    compareAtPrice: undefined,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    category: CATEGORIES[3]!,
    tags: ["new", "track", "pants"],
    gender: "unisex",
    material: "Performance poly-cotton",
    variants: [
      { id: "v5-s", size: "S", color: "Jet Black", colorHex: "#0A0A0B", sku: "OBS-TRK-JET-S", stock: 20 },
      { id: "v5-m", size: "M", color: "Jet Black", colorHex: "#0A0A0B", sku: "OBS-TRK-JET-M", stock: 18 },
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Jet Black", "Graphite"],
    status: "active",
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 23,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
  },
  {
    id: "prod-6",
    slug: "obsidian-denim-slim-midnight",
    name: "Midnight Slim Jean",
    brand: "OBSIDIAN",
    description: "Japanese selvedge denim in a modern slim taper. Raw indigo with subtle fading.",
    price: 3499,
    compareAtPrice: undefined,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      "https://images.unsplash.com/photo-1604176424472-17cd740f33b0?w=800&q=80",
    ],
    category: CATEGORIES[5]!,
    tags: ["new", "denim", "selvedge"],
    gender: "men",
    material: "Japanese selvedge denim 12oz",
    variants: [
      { id: "v6-30", size: "30", color: "Midnight Indigo", colorHex: "#1B2A4A", sku: "OBS-JEN-MID-30", stock: 6 },
      { id: "v6-32", size: "32", color: "Midnight Indigo", colorHex: "#1B2A4A", sku: "OBS-JEN-MID-32", stock: 9 },
    ],
    availableSizes: ["30", "32", "34", "36"],
    availableColors: ["Midnight Indigo", "Washed Black"],
    status: "active",
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 11,
    createdAt: "2026-07-05T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
  },
  {
    id: "prod-7",
    slug: "obsidian-swim-short-palm",
    name: "Riviera Swim Short",
    brand: "OBSIDIAN",
    description: "Quick-dry 4-way stretch swim short with tonal print. Side pockets, mesh liner.",
    price: 1499,
    compareAtPrice: undefined,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    category: CATEGORIES[6]!,
    tags: ["new", "shorts", "swim"],
    gender: "men",
    material: "Quick-dry poly",
    variants: [
      { id: "v7-s", size: "S", color: "Deep Navy", colorHex: "#1B2A4A", sku: "OBS-SWM-NAV-S", stock: 15 },
      { id: "v7-m", size: "M", color: "Deep Navy", colorHex: "#1B2A4A", sku: "OBS-SWM-NAV-M", stock: 22 },
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Deep Navy", "Bone White"],
    status: "active",
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    rating: 4.4,
    reviewCount: 7,
    createdAt: "2026-07-10T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
  },
  {
    id: "prod-8",
    slug: "obsidian-noir-fragrance",
    name: "NOIR Eau de Parfum",
    brand: "OBSIDIAN",
    description: "Oud, black amber, and vetiver. A signature scent built for the night.",
    price: 4999,
    compareAtPrice: undefined,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
    ],
    category: CATEGORIES[7]!,
    tags: ["new", "fragrance", "luxury"],
    gender: "unisex",
    material: "Oud, Black Amber, Vetiver — 50ml EDP",
    variants: [
      { id: "v8-50", size: "50ml", color: "Dark", colorHex: "#0A0A0B", sku: "OBS-FRG-NOR-50", stock: 30 },
      { id: "v8-100", size: "100ml", color: "Dark", colorHex: "#0A0A0B", sku: "OBS-FRG-NOR-100", stock: 20 },
    ],
    availableSizes: ["50ml", "100ml"],
    availableColors: ["Dark"],
    status: "active",
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 4,
    createdAt: "2026-07-12T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
  },
];

export const TRENDING: Product[] = [
  ...BESTSELLERS,
  {
    id: "prod-9",
    slug: "obsidian-chain-necklace",
    name: "Obsidian Chain Necklace",
    brand: "OBSIDIAN",
    description: "925 sterling silver Cuban link chain with black PVD coating.",
    price: 2299,
    compareAtPrice: 2999,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
    ],
    category: CATEGORIES[8]!,
    tags: ["trending", "accessories", "silver"],
    gender: "unisex",
    material: "925 Sterling Silver, Black PVD",
    variants: [
      { id: "v9-45", size: "45cm", color: "Black PVD", colorHex: "#0A0A0B", sku: "OBS-CHN-BLK-45", stock: 18 },
      { id: "v9-55", size: "55cm", color: "Black PVD", colorHex: "#0A0A0B", sku: "OBS-CHN-BLK-55", stock: 12 },
    ],
    availableSizes: ["45cm", "55cm"],
    availableColors: ["Black PVD", "Gold PVD"],
    status: "active",
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 62,
    createdAt: "2026-06-20T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
  },
];

export const DEAL_PRODUCTS: Product[] = [
  { ...BESTSELLERS[0]!, id: "deal-1", price: 899, compareAtPrice: 1999 },
  { ...BESTSELLERS[1]!, id: "deal-2", price: 1799, compareAtPrice: 3499 },
  { ...BESTSELLERS[2]!, id: "deal-3", price: 1999, compareAtPrice: 3999 },
];

// ── Reviews ────────────────────────────────────────────────────────────────── //

export interface MockReview {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  isVerified: boolean;
  product: string;
  image?: string;
}

export const REVIEWS: MockReview[] = [
  {
    id: "rev-1",
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    location: "Mumbai, IN",
    rating: 5,
    title: "Worth every rupee",
    body: "The Classic Tee is hands down the best oversized tee I own. The fabric weight is exceptional — it falls perfectly and the collar holds its shape wash after wash. OBSIDIAN has nailed what a premium basics brand should be.",
    date: "2026-07-10",
    isVerified: true,
    product: "Classic Obsidian Tee",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
  },
  {
    id: "rev-2",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    location: "Delhi, IN",
    rating: 5,
    title: "Finally a brand that gets it",
    body: "I've tried every premium streetwear brand and OBSIDIAN sits above all of them. The Fleece Hoodie arrived in a beautifully branded box — even the unboxing experience is considered. Incredible quality.",
    date: "2026-07-08",
    isVerified: true,
    product: "Fleece Arch Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
  },
  {
    id: "rev-3",
    name: "Kabir Singh",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
    location: "Bangalore, IN",
    rating: 4,
    title: "Premium, just go a size up",
    body: "The Cargo Pant is everything I hoped for. Construction is military-grade — the seams, the hardware, everything is dialed. I'm usually M but went L for the cargo fit and it's perfect. Delivery in 2 days was a pleasant surprise.",
    date: "2026-07-05",
    isVerified: true,
    product: "Tactical Cargo Pant",
  },
  {
    id: "rev-4",
    name: "Anya Kapoor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    location: "Hyderabad, IN",
    rating: 5,
    title: "The fragrance is otherworldly",
    body: "NOIR is unlike any fragrance I've experienced in this price range. The oud is warm without being sharp, and the dry-down with vetiver is incredible. I get compliments every single time I wear it.",
    date: "2026-07-01",
    isVerified: true,
    product: "NOIR Eau de Parfum",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80",
  },
];

// ── UGC Gallery ────────────────────────────────────────────────────────────── //

export interface UGCPost {
  id: string;
  image: string;
  handle: string;
  likes: number;
}

export const UGC_POSTS: UGCPost[] = [
  { id: "ugc-1", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80", handle: "@arjun.obsidian", likes: 1204 },
  { id: "ugc-2", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", handle: "@style.meets.dark", likes: 876 },
  { id: "ugc-3", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80", handle: "@wearingobsidian", likes: 2341 },
  { id: "ugc-4", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80", handle: "@priya.dark", likes: 643 },
  { id: "ugc-5", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80", handle: "@obsidian.fits", likes: 1890 },
  { id: "ugc-6", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500&q=80", handle: "@minimal.kabir", likes: 972 },
];

// ── Nav Links ──────────────────────────────────────────────────────────────── //

export const NAV_LINKS = [
  {
    label: "New In",
    href: "/collections/new-in",
    badge: "New",
  },
  {
    label: "Shop",
    href: "/shop",
    children: CATEGORIES.map((cat) => ({
      label: cat.name,
      href: `/shop/${cat.slug}`,
      image: cat.image?.url ?? "",
    })),
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Deals",
    href: "/deals",
    badge: "Hot",
  },
];

// ── Announcement Messages ──────────────────────────────────────────────────── //

export const ANNOUNCEMENT_MESSAGES = [
  "✦ Free Shipping on orders above ₹999",
  "✦ Cash on Delivery available across India",
  "✦ 30-day hassle-free returns & exchanges",
  "✦ LIMITED OFFER: Use code OBSIDIAN20 for 20% off your first order",
  "✦ New Collection Drop — Shop Now Before It Sells Out",
];
