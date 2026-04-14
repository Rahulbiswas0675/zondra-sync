/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zondra-dark': '#0a0a0a',
        'zondra-accent': '#3b82f6',
        'zondra-bg': '#121212',
        'zondra-card': '#1e1e1e',
      },
      fontFamily: {
        darker: ['Darker Grotesque', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
