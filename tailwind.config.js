/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#EDE6D6",
        "canvas-light": "#F7F4EC",
        ink: "#1A1714",
        "corner-red": "#8B2331",
        "corner-red-dark": "#6B1A25",
        gold: "#D4AF37",
        "gold-light": "#DEC079",
        slate: "#3E4A52",
        "slate-light": "#5A6A73",
        line: "rgba(26,23,20,0.14)",
        "line-strong": "rgba(26,23,20,0.28)",
        // sanctioning body belt colors
        wbc: "#009B3A",
        wba: "#000000",
        ibf: "#C8102E",
        wbo: "#800020",
        "ring-red": "#B22234",
        "ring-white": "#F5F5F5",
        "ring-blue": "#3C3B6E",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Archivo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Tailwind's default scale only includes 0.5/1.5/2.5/3.5 as fractional
      // steps — classes like p-4.5, mb-5.5, mb-6.5 used throughout the app
      // don't exist by default and silently render no spacing at all. These
      // fill the gap so every class already written just starts working,
      // instead of hand-replacing them across ~15 files.
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
      },
    },
  },
  plugins: [],
};
