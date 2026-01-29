/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3FA9F5',
          50: '#EBF6FE',
          100: '#D7EDFD',
          200: '#AFD9FB',
          300: '#87C5F9',
          400: '#63B4F7',
          500: '#3FA9F5',
          600: '#1492E6',
          700: '#1071B2',
          800: '#0C507E',
          900: '#082F4A',
        },
        secondary: {
          DEFAULT: '#4ADE80',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        background: {
          DEFAULT: '#F8FAFC',
          light: '#FFFFFF',
          dark: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
}
