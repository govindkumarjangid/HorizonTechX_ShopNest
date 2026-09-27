/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF6F3',
          100: '#FBECE7',
          200: '#F7D4CA',
          300: '#F0B3A2',
          400: '#E7886F',
          500: '#E0533C', // Primary Hero Accent
          600: '#C73F29',
          700: '#A4301D',
          800: '#832718',
          900: '#692216',
          950: '#3A0F09',
        },
        accent: {
          light: '#FDF8F0',
          amber: '#F59E0B',
          gold: '#D97706',
          darkGold: '#B45309',
        },
        neutral: {
          50: '#FAF9F7',
          100: '#F3F2EE',
          200: '#E7E5DF',
          300: '#D5D2C9',
          400: '#A6A296',
          500: '#7A766B',
          600: '#5A564D',
          700: '#3E3B34',
          800: '#262420',
          900: '#171613',
          950: '#0C0B0A',
        },
        dark: {
          bg: '#0A0B0E',
          surface: '#12141A',
          card: '#181A22',
          cardHover: '#1F222D',
          border: '#2A2E3B',
          borderSubtle: '#1F222D',
          text: '#F3F4F6',
          textMuted: '#9CA3AF',
        },
        semantic: {
          success: '#10B981',
          successBg: '#ECFDF5',
          error: '#EF4444',
          errorBg: '#FEF2F2',
          warning: '#F59E0B',
          warningBg: '#FFFBEB',
          info: '#0EA5E9',
          infoBg: '#F0F9FF',
          sale: '#E11D48',
          saleBg: '#FFF1F2',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(16, 24, 40, 0.05), 0 1px 4px -1px rgba(16, 24, 40, 0.03)',
        'elevated': '0 12px 32px -4px rgba(16, 24, 40, 0.08), 0 4px 12px -2px rgba(16, 24, 40, 0.04)',
        'floating': '0 24px 48px -12px rgba(16, 24, 40, 0.16)',
        'dark-subtle': '0 4px 20px 0 rgba(0, 0, 0, 0.45)',
        'dark-elevated': '0 12px 36px 0 rgba(0, 0, 0, 0.65)',
        'glow-brand': '0 0 24px -4px rgba(224, 83, 60, 0.35)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
