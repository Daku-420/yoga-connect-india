/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#263D32',
          50: '#F4F7F5',
          100: '#E4EAE6',
          200: '#C7D4CC',
          300: '#9FB5A7',
          400: '#698A74',
          500: '#3D5E4C',
          600: '#263D32',
          700: '#1E3228',
          800: '#16251E',
          900: '#0E1914',
          950: '#09100D',
        },
        sage: {
          DEFAULT: '#536B50',
          hover: '#40563E',
          soft: '#A5B89A',
          surface: '#E6EDE2',
          50: '#F4F7F3',
          100: '#E6EDE2',
          200: '#C9D7C4',
          300: '#A5B89A',
          400: '#7E9A75',
          500: '#536B50',
          600: '#40563E',
          700: '#324530',
          800: '#263525',
          900: '#1B261A',
          950: '#102018',
        },
        ivory: {
          DEFAULT: '#F7F5EE',
          dark: '#EDE8DC',
          50: '#FDFCF9',
          100: '#F7F5EE',
          200: '#EDE8DC',
        },
        charcoal: {
          DEFAULT: '#252C27',
          text: '#252C27',
        },
        secondary: {
          DEFAULT: '#59665C',
          text: '#59665C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          sage: '#E6EDE2',
          ivory: '#F7F5EE',
        },
        border: {
          DEFAULT: '#E2E5DD',
          subtle: '#E2E5DD',
        },
        sand: {
          DEFAULT: '#DCCDB5',
          accent: '#DCCDB5',
          50: '#FDFBF7',
          100: '#F8F4EC',
          200: '#F1E8D7',
          300: '#E6D7BC',
          400: '#DCCDB5',
          500: '#C5A77C',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FBEBE4',
          200: '#F7D3C4',
          300: '#F0B29A',
          400: '#E58769',
          500: '#536B50', // graceful remapping to sage green
          600: '#536B50',
          700: '#40563E',
          800: '#263D32',
          900: '#1E3228',
        },
        gold: {
          400: '#DCCDB5',
          500: '#DCCDB5',
          600: '#B89228',
        },
        success: '#286749',
        error: '#B42318',
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
