import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        obsidian: {
          DEFAULT: '#0A0A0B',
          50: '#1A1A1C',
          100: '#141415',
          900: '#050506',
        },
        charcoal: {
          DEFAULT: '#1C1C1E',
          light: '#2C2C2E',
          dark: '#0F0F10',
        },
        bone: {
          DEFAULT: '#FAFAF9',
          50: '#F5F5F4',
          100: '#EFEFED',
          200: '#E5E5E3',
        },
        champagne: {
          DEFAULT: '#C6A15B',
          light: '#D4B87A',
          dark: '#9C7A3C',
          50: '#F5EDD8',
          100: '#E8D5A8',
        },
        'deep-gold': '#9C7A3C',

        // Semantic tokens (map to brand)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', ...fontFamily.serif],
        sans: ['var(--font-inter)', 'Inter', ...fontFamily.sans],
        display: ['var(--font-cormorant)', 'Cormorant Garamond', ...fontFamily.serif],
        body: ['var(--font-inter)', 'Inter', ...fontFamily.sans],
      },

      fontSize: {
        // Display scale (Cormorant)
        'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.15' }],
        // UI scale (Inter)
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '100': '25rem',
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
        '200': '50rem',
      },

      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198, 161, 91, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(198, 161, 91, 0)' },
        },
        'ticker': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 0.4s ease-in-out',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-obsidian': 'linear-gradient(135deg, #0A0A0B 0%, #1C1C1E 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C6A15B 0%, #9C7A3C 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(10,10,11,0) 0%, rgba(10,10,11,0.5) 50%, rgba(10,10,11,0.9) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(198,161,91,0.1) 50%, transparent 100%)',
      },

      boxShadow: {
        'gold': '0 0 20px rgba(198, 161, 91, 0.3)',
        'gold-lg': '0 0 40px rgba(198, 161, 91, 0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'inner-gold': 'inset 0 0 0 1px rgba(198,161,91,0.3)',
      },

      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};

export default config;
