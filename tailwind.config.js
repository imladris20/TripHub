/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mygreen: "#C6F1E7",
        myblue: "#82A0D8",
        myyellow: "#ECEE81",
        mypurple: "#EDB7ED",
        mygray: "#E8F1F2",
      },
    },
  },
  plugins: [],
};
