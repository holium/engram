/** @type {import('tailwindcss').Config} */

const scale = {
  0: "0px",
  "": "1px",
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
      sys: "var(--rlm-font, \"Rubik\", sans-serif)",
      azimuth: "Source Code Pro",
    },
    fontSize: {
      sm: "14px",
      body: "16px",
      heading: "16px"
    },
    lineHeight: {
      base: "1.2599em",
    },
    colors: {
      none: "#00000000",
      type: "rgba(var(--rlm-text-rgba, 51, 51, 51))",
      paper: "rgba(var(--rlm-card-rgba, 255, 255, 255))",
      icon: "rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))",
      base: "rgba(var(--rlm-base-rgba, 196, 195, 191))",
      window: "rgba(var(--rlm-window-rgba, 255, 255, 255, .8))",
      border: "rgba(var(--rlm-border-rgba, 230, 230, 230))",
      accent: "rgba(var(--rlm-accent-rgba, 78, 158, 253))",
      hover: "rgba(var(--rlm-overlay-hover-rgba, 0, 0, 0, 0.04))",
      active: "rgba(var(--rlm-overlay-active-rgba, 0, 0, 0, 0.06))"
    },
    spacing: scale,
    borderRadius: {
      "full": "100%",
      ...scale
    },
    borderWidth: scale,
    outlineWidth: scale,
    boxShadow: {
      menu: "var(--rlm-box-shadow-lifted, 0px 0px 4px rgba(0, 0, 0, 0.24))",
      sunk: "inset var(--rlm-box-shadow-lifted, 0px 0px 4px rgba(0, 0, 0, 0.24))",
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
