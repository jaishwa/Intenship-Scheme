import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://obsidian-store.com';

  const staticRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/collections/new-arrivals', priority: 0.8, changeFrequency: 'daily' as const },
    { route: '/collections/bestsellers', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/collections/trending', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/categories/oversized-tees', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/shirts', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/hoodies', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/track-pants', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/cargo-pants', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/jeans', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/shorts', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/fragrance', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/categories/accessories', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/returns', priority: 0.4, changeFrequency: 'monthly' as const },
    { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return staticRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
