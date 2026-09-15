/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070913',
          900: '#0b0f19',
          850: '#111827',
          800: '#151d30',
          700: '#1e293b',
          600: '#334155'
        },
        rgb: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      backgroundImage: {
        'rgb-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        'rgb-gradient-subtle': 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)',
        'rgb-glow': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.25) 0%, rgba(11, 15, 25, 0) 70%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)'
      },
      boxShadow: {
        'rgb-glow': '0 0 25px -5px rgba(139, 92, 246, 0.4), 0 0 10px -2px rgba(59, 130, 246, 0.3)',
        'rgb-glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'rgb-glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
