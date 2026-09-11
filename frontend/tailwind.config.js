import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-variant": "#b1f2be",
        "surface-container-low": "#d1ffd8",
        "on-primary-fixed-variant": "#005323",
        "on-secondary-fixed": "#001d31",
        "inverse-primary": "#79db8d",
        "secondary": "#006398",
        "secondary-fixed-dim": "#93ccff",
        "inverse-on-surface": "#c3ffce",
        "outline": "#6f7a6e",
        "on-error": "#ffffff",
        "surface-container": "#bcfdc9",
        "surface-container-lowest": "#ffffff",
        "secondary-container": "#5bb8fe",
        "outline-variant": "#becabc",
        "primary": "#00652c",
        "on-background": "#00210d",
        "on-error-container": "#93000a",
        "on-surface": "#00210d",
        "tertiary": "#7b4d00",
        "surface-tint": "#006d30",
        "primary-fixed": "#95f8a7",
        "tertiary-fixed": "#ffddb8",
        "surface-dim": "#a9e9b6",
        "error": "#ba1a1a",
        "on-secondary-container": "#00476e",
        "on-surface-variant": "#3f493f",
        "on-tertiary-fixed": "#2a1700",
        "secondary-fixed": "#cce5ff",
        "on-primary-container": "#d3ffd5",
        "on-tertiary-fixed-variant": "#653e00",
        "primary-fixed-dim": "#79db8d",
        "surface-container-high": "#b7f7c3",
        "on-primary": "#ffffff",
        "surface-container-highest": "#b1f2be",
        "on-secondary": "#ffffff",
        "error-container": "#ffdad6",
        "surface": "#eaffea",
        "on-tertiary": "#ffffff",
        "inverse-surface": "#00391a",
        "background": "#eaffea",
        "tertiary-container": "#9c6300",
        "tertiary-fixed-dim": "#ffb95f",
        "surface-bright": "#eaffea",
        "on-primary-fixed": "#00210a",
        "on-tertiary-container": "#fff2e7",
        "primary-container": "#15803d",
        "on-secondary-fixed-variant": "#004b73"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["22px", { "lineHeight": "28px", "fontWeight": "700" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-sm": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
        "label-md": ["13px", { "lineHeight": "18px", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "label-lg": ["15px", { "lineHeight": "20px", "fontWeight": "600" }],
        "headline-xl": ["40px", { "lineHeight": "48px", "fontWeight": "800" }],
        "headline-xl-mobile": ["30px", { "lineHeight": "38px", "fontWeight": "800" }],
        "label-sm": ["11px", { "lineHeight": "14px", "fontWeight": "700" }]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
