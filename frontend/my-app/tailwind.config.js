/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#08080a",
          surface: "#111114",
          border: "#1c1c20",
          gold: "#C9A84C",
          "gold-light": "#E4C46A",
          "gold-muted": "#A68A4C",
          muted: "#5a5a62",
        },
      },
      fontFamily: {
        sans: ["Geist Variable", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
