import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { Providers } from './providers';
import './globals.css';

const SITE_NAME = 'OBSIDIAN';
const SITE_DESCRIPTION =
  'Premium fashion for the discerning individual. Explore our curated collection of oversized tees, hoodies, shirts, cargos, and more.';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://obsidian-store.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium Fashion`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'premium fashion',
    'oversized tees',
    'hoodies',
    'streetwear',
    'OBSIDIAN',
    'luxury clothing',
    'cargo pants',
    'fragrance',
  ],
  authors: [{ name: 'OBSIDIAN', url: SITE_URL }],
  creator: 'OBSIDIAN',
  publisher: 'OBSIDIAN',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium Fashion`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Premium Fashion`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@obsidianstore',
    creator: '@obsidianstore',
    title: `${SITE_NAME} — Premium Fashion`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAF9' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-obsidian antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
