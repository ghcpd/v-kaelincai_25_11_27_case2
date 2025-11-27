/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'laptop-13': '1280px',
        'tablet': '768px',
        'mobile': '640px',
      },
    },
  },
  plugins: [],
}
