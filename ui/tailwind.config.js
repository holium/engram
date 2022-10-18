/** @type {import('tailwindcss').Config} */

const scale = {
  0: "0px",
  1: "2px",
  2: "4px",
  3: "8px",
  4: "16px",
  5: "32px",
  6: "64px",
  7: "128px",
  8: "256px",
};

module.exports = {
  content: ["index.html", "./src/App.vue", "./src/**/*.{js,ts,css,vue}"],
  theme: {
    fontFamily: {
      sys: "var(--rlm-font, sans-serif)",
      azimuth: "Source Code Pro",
    },
    fontSize: {
      base: "16px",
    },
    colors: {
      type: "var(--rlm-text-color, #261f1f)",
      paper: "var(--rlm-card-color, #FAFBFB)",
      icon: "var(--rlm-icon-color, #333333)",
      base: "var(--rlm-base-color, #B4BDC2)",
      window: "var(--rlm-window-color, #ECEFF0)",
      border: "var(--rlm-border-color, #D7D0DA)",
      accent: "var(--rlm-accent-color, #4E9EFD)",
    },
    spacing: scale,
    borderRadius: scale,
    borderWidth: scale,
    outlineWidth: scale,
    boxShadow: {
      menu: "0 0px 16px -4px var(--border-color)",
      sunk: "inset 0 0 4px -2px var(--border-color)",
    },
    width: { ...scale, full: "100%", window: "100vw" },
    height: { ...scale, full: "100%", window: "100vh" },
    maxWidth: { ...scale, full: "100%", window: "100vw" },
    maxHeight: { ...scale, full: "100%", window: "100vh" },
    minWidth: { ...scale, full: "100%", window: "100vw" },
    minHeight: { ...scale, full: "100%", window: "100vh" },
    extend: {},
  },
  plugins: [],
};
