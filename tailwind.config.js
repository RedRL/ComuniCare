/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the ComuniCare logo
        brand: {
          navy: "#1E2966",
          navyDeep: "#152049",
          navySoft: "#3B4994",
          coral: "#ED7B5A",
          coralDeep: "#D9603F",
          coralSoft: "#F2A287",
          coralWash: "#FBE3D8",
          cream: "#fcf2ee",
          creamSoft: "#fdf7f4",
        },
        cream: {
          50: "#fcf2ee",
          100: "#f8e3da",
        },
        sky: {
          soft: "#DCEAFB",
          softer: "#EAF2FC",
        },
        mint: {
          soft: "#D9F0E5",
          softer: "#E9F6EF",
        },
        lavender: {
          soft: "#E0DBF1",
          softer: "#EEEAF7",
        },
        peach: {
          soft: "#FBD9C8",
          softer: "#FDEADF",
        },
        ink: {
          900: "#1E2966",
          700: "#3B4994",
          500: "#6B7280",
          400: "#9AA1AE",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(30, 41, 102, 0.18)",
        card: "0 6px 18px -10px rgba(30, 41, 102, 0.18)",
        glow: "0 12px 40px -16px rgba(237, 123, 90, 0.45)",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "fade-out": "fadeOut 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out",
        "soft-pulse": "softPulse 2.4s ease-in-out infinite",
        breathe: "breathe 3.6s ease-in-out infinite",
        "spin-slow": "spin 1.6s linear infinite",
        "heart-beat": "heartBeat 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        softPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        heartBeat: {
          "0%, 100%": { transform: "scale(1)" },
          "20%": { transform: "scale(1.12)" },
          "40%": { transform: "scale(0.98)" },
          "60%": { transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};
