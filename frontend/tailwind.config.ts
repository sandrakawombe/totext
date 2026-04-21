import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:    { DEFAULT: "#FBF6EF", 100: "#F5EDE2" },
        lavender: { 100: "#E8DBFA", 200: "#D8C9F7", 300: "#C9B8F5",
                    400: "#B7A2F0", 500: "#8E76E0", 600: "#7B5FCF" },
        blush:    { 100: "#FCE6EE", 200: "#F7C8D9", 300: "#F4B0C7",
                    400: "#E48BAC", 500: "#C9577A" },
        nude:     { 100: "#F5E6D8", 200: "#ECD9C2", 300: "#D6BC9A" },
        plum:     { DEFAULT: "#2A1B3D", soft: "#4A3560", ink: "#1B0F2B" },
        magenta:  "#E8508D",
        mint:     "#C4E8D0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      boxShadow: {
        soft: "0 18px 40px -18px rgba(123,95,207,0.4)",
        ink:  "0 10px 30px -12px rgba(27,15,43,0.5)",
      },
      keyframes: {
        drift:     { "0%,100%": { transform: "translate(0,0) scale(1)" },
                     "50%":     { transform: "translate(40px,-30px) scale(1.08)" } },
        pulseRing: { "0%,100%": { boxShadow: "0 0 0 8px rgba(232,80,141,0.2)" },
                     "50%":     { boxShadow: "0 0 0 18px rgba(232,80,141,0)" } },
        vu:        { "0%,100%": { transform: "scaleY(1)" },
                     "50%":     { transform: "scaleY(0.3)" } },
      },
      animation: {
        drift:     "drift 22s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-in-out infinite",
        vu:        "vu 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
