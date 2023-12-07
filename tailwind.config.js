/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#45BB89",
          secondary: "#bbf7d0",
          accent: "#67e8f9",
          neutral: "#bbf7d0",
          "base-100": "#ffffff",
          info: "#e9d5ff",
          success: "#fcd34d",
          warning: "#f87171",
          error: "#dc2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mygreen: "#C6F1E7",
        myblue: "#82A0D8",
        myyellow: "#ECEE81",
        mypurple: "#EDB7ED",
        mygray: "#E8F1F2",
        sand: "#ead6db",
        deyork: "#87C488",
      },
    },
  },
};
