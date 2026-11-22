/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#ebdcc8',
          300: '#ddc2a4',
          400: '#cca37f',
          500: '#be8862',
          600: '#aa7052',
          700: '#8e5944',
          800: '#73483b',
          900: '#5e3c33',
        }
      }
    },
  },
  plugins: [],
}

