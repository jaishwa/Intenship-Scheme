import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import { Providers } from "@/lib/providers";
import "@/app/globals.css";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0B" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAFAF9" />

        {/* PWA viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${fontVariables} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
