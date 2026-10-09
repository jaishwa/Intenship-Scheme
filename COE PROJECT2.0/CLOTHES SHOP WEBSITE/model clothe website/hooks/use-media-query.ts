"use client";

import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINTS: Record<Breakpoint, string> = {
  xs: "(max-width: 479px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

/**
 * Hook to check if a media query matches.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isLarge = useMediaQuery("lg");  // Uses Tailwind breakpoint
 */
export function useMediaQuery(query: string | Breakpoint): boolean {
  const resolvedQuery = (BREAKPOINTS[query as Breakpoint] ?? query) as string;

  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(resolvedQuery);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [resolvedQuery]);

  return matches;
}

/**
 * Convenience hooks for common breakpoints
 */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("md");
export const useIsDesktop = () => useMediaQuery("lg");
export const useIsLargeDesktop = () => useMediaQuery("xl");
