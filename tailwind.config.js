/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#4F46E5",
        primaryDark: "#4338CA",
        secondary: "#FBBF24",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: {
          base: "#1F2937",
          muted: "#6B7280",
          inverted: "#FFFFFF",
        },
      },
      spacing: {
        section: "2.5rem",
        content: "1.25rem",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
}
