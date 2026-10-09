import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://obsidian.fashion";
const SITE_NAME = "OBSIDIAN";
const SITE_DESCRIPTION =
  "Premium fashion brand crafting timeless pieces for the discerning individual. Explore our curated collections of luxury ready-to-wear.";

/**
 * Base / default metadata applied to the root layout.
 * Individual pages should call `generateMetadata()` to extend or override these.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Premium Fashion`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "premium fashion",
    "luxury clothing",
    "designer wear",
    "obsidian fashion",
    "ready-to-wear",
    "capsule wardrobe",
    "minimalist fashion",
    "editorial style",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium Fashion`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Premium Fashion`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@obsidianfashion",
    creator: "@obsidianfashion",
    title: `${SITE_NAME} — Premium Fashion`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0A0A0B" }],
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: SITE_URL,
  },
};

// ── Factory function ────────────────────────────────────────────────────── //

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Factory for generating per-page metadata that extends the base defaults.
 *
 * @example
 * ```ts
 * export const metadata = generatePageMetadata({
 *   title: "Shop",
 *   description: "Browse our full collection.",
 *   path: "/shop",
 * });
 * ```
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/og-image.jpg",
  noIndex = false,
}: GenerateMetadataOptions = {}): Metadata {
  const pageUrl = `${SITE_URL}${path}`;
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Fashion`;
  const pageDescription = description ?? SITE_DESCRIPTION;

  return {
    title: pageTitle,
    description: pageDescription,

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: SITE_NAME,
      title: pageTitle,
      description: pageDescription,
      images: [{ url: image, width: 1200, height: 630, alt: pageTitle }],
    },

    twitter: {
      card: "summary_large_image",
      site: "@obsidianfashion",
      title: pageTitle,
      description: pageDescription,
      images: [image],
    },

    alternates: {
      canonical: pageUrl,
    },
  };
}
