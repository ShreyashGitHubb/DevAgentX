/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-container": "var(--on-secondary-container)",
        "outline": "var(--outline)",
        "on-error-container": "#ffdad6",
        "primary-fixed-dim": "#00dbe9",
        "inverse-primary": "#006970",
        "outline-variant": "var(--outline-variant)",
        "error": "#ffb4ab",
        "primary": "var(--primary)",
        "on-secondary-fixed-variant": "#5516be",
        "on-primary-container": "#006970",
        "secondary": "var(--secondary)",
        "primary-container": "var(--primary-container)",
        "inverse-on-surface": "#283044",
        "surface": "var(--surface)",
        "surface-container-low": "var(--surface-container-low)",
        "on-primary": "#00363a",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-variant": "var(--surface-variant)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "secondary-fixed": "#e9ddff",
        "secondary-container": "var(--secondary-container)",
        "on-surface-variant": "var(--on-surface-variant)",
        "tertiary": "var(--tertiary)",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",
        "surface-bright": "#31394d",
        "on-primary-fixed": "#002022",
        "on-primary-fixed-variant": "#004f54",
        "on-background": "#dae2fd",
        "on-secondary": "#3c0091",
        "on-error": "#690005",
        "on-tertiary-fixed-variant": "#005236",
        "surface-tint": "#00dbe9",
        "error-container": "#93000a",
        "surface-dim": "var(--surface-dim)",
        "inverse-surface": "#dae2fd",
        "background": "var(--background)",
        "tertiary-container": "var(--tertiary-container)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "on-secondary-fixed": "#23005c",
        "primary-fixed": "#7df4ff",
        "on-tertiary": "#003824",
        "on-tertiary-container": "#006d4a",
        "surface-container": "var(--surface-container)",
        "on-surface": "var(--on-surface)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.125rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "32px",
        "gutter": "16px",
        "margin-mobile": "16px",
        "unit": "4px",
        "panel-padding": "24px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "code-md": ["JetBrains Mono", "monospace"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "label-sm": ["Inter", "sans-serif"]
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-dash': 'flow-dash 1.5s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' },
          '50%': { opacity: '1', boxShadow: '0 0 25px rgba(0, 240, 255, 0.8)' },
        },
        'flow-dash': {
          to: { 'stroke-dashoffset': '-20' },
        }
      }
    },
  },
  plugins: [],
}
