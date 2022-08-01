const unit = 2;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
      menu: "0 5px 17px #26262620",
      sunk: "inset 0 0 3px -2px #26262620",
    },
    extend: {},
  },
  plugins: [],
};
