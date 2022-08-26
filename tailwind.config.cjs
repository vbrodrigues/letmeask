/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        title: "Poppins",
      },
      fontWeight: 400,
      colors: {
        gray: {
          100: "#FFF",
          200: "#F4F0FF",
          300: "#F1F1F1",
          500: "#DBDCDD",
          600: "#CECECE",
          700: "#737380",
          900: "#29292E",
        },
        purple: {
          300: "#835AFD",
          500: "#6F4BD8",
        },
        red: {
          100: "#EA4335",
          300: "#E73F5D",
          500: "#D73754",
        },
        pink: {
          500: "#E559F9",
        },
      },
    },
  },
  plugins: [],
};
