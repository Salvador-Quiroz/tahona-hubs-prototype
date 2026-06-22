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
      spacing: {
        "4xs": "0.125rem",
        "3xs": "0.25rem",
        "2xs": "0.5rem",
        xs: "0.75rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
        "3xl": "6rem",
        "4xl": "8rem"
      },
      colors: {
        paper: "var(--paper)",
        "paper-raised": "var(--paper-raised)",
        "paper-sunken": "var(--paper-sunken)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        crust: "var(--crust)",
        "crust-soft": "var(--crust-soft)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ok: "var(--ok)",
        "ok-bg": "var(--ok-bg)",
        warn: "var(--warn)",
        "warn-bg": "var(--warn-bg)",
        brand: "var(--brand)",
        "brand-press": "var(--brand-press)",
        "brand-tint": "var(--brand-tint)",
        "brand-hover": "var(--brand-press)",
        "brand-soft": "var(--brand-tint)",
        "brand-grid": "var(--brand-grid)",
        "accent-edge": "var(--accent-edge)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "border-strong": "var(--border-strong)",
        text: "var(--text)",
        "text-2": "var(--text-2)",
        "text-3": "var(--text-3)",
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--brand-soft)",
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--brand)",
          foreground: "var(--surface)"
        },
        secondary: {
          DEFAULT: "var(--accent)",
          foreground: "var(--text)"
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-2)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--text)"
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "var(--surface)"
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)"
        },
        success: {
          DEFAULT: "var(--success)",
          bg: "var(--success-bg)"
        },
        warning: {
          DEFAULT: "var(--warning)",
          bg: "var(--warning-bg)"
        },
        danger: {
          DEFAULT: "var(--danger)",
          bg: "var(--danger-bg)"
        },
        info: {
          DEFAULT: "var(--info)",
          bg: "var(--info-bg)"
        },
        tahona: {
          blue: "var(--brand)",
          cobalt: "var(--brand)",
          grid: "var(--brand-grid)",
          yellow: "var(--accent)",
          maiz: "var(--accent)",
          maize: "var(--accent)",
          ink: "var(--text)",
          coffee: "var(--text)",
          cacao: "var(--text)",
          cream: "var(--bg)",
          masa: "var(--surface)",
          pink: "var(--brand-soft)",
          rose: "var(--brand-soft)",
          paper: "var(--brand-soft)",
          nopal: "var(--success)",
          red: "var(--danger)",
          terracotta: "var(--danger)",
          crust: "var(--brand-grid)",
          cantera: "var(--border-strong)",
          slate: "var(--text-2)",
          steel: "var(--text-3)",
          line: "var(--border)"
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        soft: "var(--shadow-sm)",
        lift: "var(--shadow-md)",
        editorial: "var(--shadow-lg)",
        control: "var(--shadow-sm)"
      },
      fontSize: {
        display: ["clamp(2.25rem,5vw,3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["clamp(1.75rem,3vw,2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        h2: ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.3" }],
        "body-l": ["1.125rem", { lineHeight: "1.55" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-s": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.04em" }]
      },
      fontFamily: {
        display: ["var(--font-serif)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Segoe UI", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "Consolas", "monospace"]
      },
      transitionDuration: {
        instant: "100ms",
        micro: "120ms",
        short: "200ms",
        fast: "160ms",
        base: "240ms",
        slow: "360ms",
        hero: "480ms"
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
