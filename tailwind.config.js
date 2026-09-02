/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep charcoal / near-black surfaces
        ink: {
          950: "#0b0a09",
          900: "#141210",
          850: "#1b1815",
          800: "#211d19",
          700: "#2b2621",
          600: "#3a332c",
        },
        // Bhagwa / saffron orange
        saffron: {
          50: "#fff5eb",
          100: "#ffe6cc",
          200: "#ffcb99",
          300: "#ffab5e",
          400: "#ff8c2b",
          500: "#f2731a",
          600: "#d95c10",
          700: "#b4470e",
          800: "#8f3a12",
          900: "#743113",
        },
        // Warm gold accents
        gold: {
          200: "#f7e6b8",
          300: "#efd28a",
          400: "#e4b95c",
          500: "#d4a13a",
          600: "#b8842a",
        },
        // Cream / off-white text
        cream: {
          50: "#fbf7f0",
          100: "#f4ecdf",
          200: "#e7d9c3",
          300: "#d3c0a3",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        deva: ["Mukta", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.30), 0 8px 24px -8px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(228,185,92,0.14), 0 12px 40px -12px rgba(242,115,26,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};
