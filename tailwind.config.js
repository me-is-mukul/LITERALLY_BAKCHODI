/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'spin-slow': 'spinSlow 12s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer-shine': 'shimmerShine 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmerShine: {
          '0%': { backgroundPosition: '-1200px 0' },
          '100%': { backgroundPosition: '1200px 0' },
        },
      }
    },
  },
  plugins: [],
}