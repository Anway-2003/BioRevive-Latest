/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Ha path chukla ki CSS disat nahi
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A5D1A",
        secondary: "#F3F4F6",
        critical: "#DC2626",
        watch: "#F59E0B",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}