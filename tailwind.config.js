/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // primary: '#f1bf42',
        primary: '#fe6845',
      },
    },
  },
  plugins: ['@tailwindcss/line-clamp'],
}
