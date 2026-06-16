import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        tahona: {
          ink: "#4A2B18",
          coffee: "#4A2B18",
          cacao: "#2B1A10",
          yellow: "#F1DA79",
          maiz: "#F1DA79",
          maize: "#F1DA79",
          cream: "#F7F1E2",
          masa: "#FFF8EA",
          pink: "#F3DCE4",
          rose: "#F3DCE4",
          paper: "#E9D9B7",
          nopal: "#60704E",
          red: "#9F3A2D",
          terracotta: "#9F3A2D",
          crust: "#C78A46",
          cantera: "#D7C4A7"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(74, 43, 24, 0.10)",
        lift: "0 16px 32px rgba(74, 43, 24, 0.16)",
        editorial: "0 34px 90px rgba(74, 43, 24, 0.22)"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Manrope", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
