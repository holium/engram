const unit = 2;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      body: "16px",
    },
    fontFamily: {
      azimuth: "IBM Plex Mono, monospace",
    },
    spacing: {
      before: "1em",
      after: `${unit ** -1}em`,
      /* Pixels */
      0: "0px",
      1: `${unit ** 1}px`,
      2: `${unit ** 2}px`,
      3: `${unit ** 3}px`,
      4: `${unit ** 4}px`,
      5: `${unit ** 5}px`,
      6: `${unit ** 6}px`,
      7: `${unit ** 7}px`,
      8: `${unit ** 8}px`,
    },
    borderRadius: {
      /* Pixels */
      0: "0px",
      1: `${unit ** 1}px`,
      2: `${unit ** 2}px`,
      3: `${unit ** 3}px`,
      4: `${unit ** 4}px`,
      5: `${unit ** 5}px`,
      6: `${unit ** 6}px`,
      7: `${unit ** 7}px`,
      8: `${unit ** 8}px`,
    },
    boxShadow: {
      menu: "0 0px 16px -4px var(--trim-color)",
      sunk: "inset 0 0 4px -2px var(--trim-color)",
    },
    extend: {
      colors: {
        none: "#00000000",
        pallet: {
          0: "#ef4444",
          1: "#f97316",
          2: "#f59e0b",
          3: "#ca8a04",
          4: "#84cc16",
          5: "#22c55e",
          6: "#10b981",
          7: "#14b8a6",
          8: "#06b6d4",
          9: "#0ea5e9",
          10: "#3b82f6",
          11: "#6366f1",
          12: "#8b5cf6",
          13: "#a855f7",
          14: "#d946ef",
          15: "#ec4899",
          16: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
