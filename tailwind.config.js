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
        blueWillow: "#9CB3C5",
        sage: "#586C50",
        flame: "#D5683D",
        fawn: "#865B2E",
        tundra: "#9EA2AB",
        glacierBlue: "#6D8DB6",
        cider: "#A16F3A",
        myslate: "#607178",
        charcoal: "#353C42",
        oxford: "#01273C",
        chinchilla: "#928A99",
        grape: "#9D6AB9",
        havelock: "#596FB5",
        tawny: "#9A6231",
        moss: "#778633",
        lipstick: "#D4587A",
        ballet: "#E6B6C2",
        opium: "#876363",
        steelBlue: "#4579A0",
        rust: "#A35D22",
        fruitSalad: "#5EAA5F",
        labrodorite: "#608796",
        apricot: "#EB9772",
        smoke: "#FF445F",
        thistle: "#867282",
        monarch: "#E98D24",
        olivine: "#9AB878",
        casablanca: "#F3B749",
        shrimp: "#F69864",
        yam: "#CC5B3B",
        copper: "#B16B2F",
        tabasco: "#9A2513",
        brandy: "#D8B484",
        peach: "#EEB3A3",
        azalea: "#E6AECF",
        pacific: "#01ACBD",
        keppel: "#77BCA9",
        lavender: "#A299CA",
        seafoam: "#7CCAAE",
        carrot: "#FD9735",
      },
    },
  },
};
