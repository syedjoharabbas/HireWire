/** @type {import('tailwindcss').Config} */
module.exports = {
  // enable class-based dark mode so we can toggle programmatically
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // neutralGlass is used for glassy dark/light fallbacks in index.css
        neutralGlass: {
          50: '#fbfbfc',
          100: '#f5f6f7',
          200: '#eceef1',
          300: '#d9dce0',
          400: '#bfc6cc',
          500: '#98a0a7',
          600: '#6f777f',
          700: '#40464d',
          800: '#111518',
          900: '#0b0f12'
        },
        // brand gradients & subtle accents
        brand: {
          50: '#eef7ff',
          100: '#dbeeff'
        }
      },
      boxShadow: {
        'lux-1': '0 6px 24px rgba(14,20,56,0.08)',
        'lux-2': '0 12px 40px rgba(14,20,56,0.12)'
      }
    },
  },
  plugins: [],
}