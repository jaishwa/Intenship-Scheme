import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // OBSIDIAN Brand Palette
        obsidian: {
          DEFAULT: "#0A0A0B",
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#C8C8C9",
          300: "#9A9A9C",
          400: "#6B6B6E",
          500: "#3D3D40",
          600: "#2A2A2D",
          700: "#1C1C1E",
          800: "#131314",
          900: "#0A0A0B",
          950: "#050506",
        },
        charcoal: {
          DEFAULT: "#1C1C1E",
          light: "#2C2C2E",
          dark: "#141416",
        },
        bone: {
          DEFAULT: "#FAFAF9",
          50: "#FFFFFF",
          100: "#FAFAF9",
          200: "#F0F0EF",
          300: "#E0E0DE",
          400: "#C4C4C2",
        },
        gold: {
          champagne: "#C6A15B",
          deep: "#9C7A3C",
          light: "#D4B47A",
          pale: "#E8D4A8",
          muted: "#A88B4E",
        },
        // Semantic aliases
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25" }],
        "display-xs": ["1.5rem", { lineHeight: "1.3" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "104": "26rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "obsidian-sm": "0 1px 3px 0 rgba(10,10,11,0.4), 0 1px 2px -1px rgba(10,10,11,0.4)",
        "obsidian-md": "0 4px 6px -1px rgba(10,10,11,0.4), 0 2px 4px -2px rgba(10,10,11,0.4)",
        "obsidian-lg": "0 10px 15px -3px rgba(10,10,11,0.5), 0 4px 6px -4px rgba(10,10,11,0.5)",
        "obsidian-xl": "0 20px 25px -5px rgba(10,10,11,0.5), 0 8px 10px -6px rgba(10,10,11,0.5)",
        "gold-glow": "0 0 20px rgba(198,161,91,0.2), 0 0 40px rgba(198,161,91,0.1)",
        "gold-glow-sm": "0 0 10px rgba(198,161,91,0.15)",
        "inner-light": "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "obsidian-gradient": "linear-gradient(135deg, #0A0A0B 0%, #1C1C1E 100%)",
        "gold-gradient": "linear-gradient(135deg, #C6A15B 0%, #9C7A3C 100%)",
        "gold-shimmer": "linear-gradient(105deg, #9C7A3C 0%, #C6A15B 40%, #D4B47A 60%, #9C7A3C 100%)",
        "bone-gradient": "linear-gradient(180deg, #FAFAF9 0%, #F0F0EF 100%)",
        "radial-obsidian": "radial-gradient(ellipse at center, #1C1C1E 0%, #0A0A0B 70%)",
        "hero-vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,11,0.8) 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "drawer-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "drawer-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "fade-down": "fade-down 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "drawer-in": "drawer-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "drawer-out": "drawer-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
