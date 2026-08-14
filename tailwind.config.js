/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f5',
          100: '#e3ece6',
          200: '#c6d9cd',
          300: '#9ebfa9',
          400: '#72a082',
          500: '#508362',
          600: '#3d694d',
          700: '#2d4a3e',
          800: '#264237',
          900: '#1e3a2b',
          950: '#102018',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fbebe4',
          200: '#f7d3c4',
          300: '#f0b29a',
          400: '#e58769',
          500: '#c86d51',
          600: '#b85438',
          700: '#99432d',
          800: '#7e3a29',
          900: '#673326',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#f1e8d7',
          300: '#e6d7bc',
          400: '#d7c09c',
          500: '#c5a77c',
        },
        gold: {
          400: '#e0c055',
          500: '#d4af37',
          600: '#b89228',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(30, 58, 43, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
