import { Playfair_Display, Inter } from "next/font/google";

/**
 * Playfair Display — Editorial serif for display headings
 * Used for hero titles, section headers, product names
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

/**
 * Inter — Clean geometric grotesk for UI and body
 * Used for navigation, body copy, labels, buttons
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/** Combined font class string for root layout className */
export const fontVariables = `${playfair.variable} ${inter.variable}`;
