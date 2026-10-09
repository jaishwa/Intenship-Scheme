/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'cyber-scan': 'cyberScan 3s infinite linear',
        'float-slow': 'floatSlow 6s infinite ease-in-out',
        'grid-pulse': 'gridPulse 10s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.45))' },
          '50%': { transform: 'scale(1.03)', filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.8))' },
        },
        cyberScan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        gridPulse: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        }
      }
    },
  },
  plugins: [],
}

