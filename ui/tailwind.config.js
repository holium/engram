const unit = 2;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    color: {
      paper: "#FBFBFB",
      type: "#474747",
      gray: "#6F6F6F",
      glass: "FFFFFF66",
    },
    spacing: {
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
    extend: {},
  },
  plugins: [],
};
