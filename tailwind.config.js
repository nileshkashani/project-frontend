export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"], // Example
        mono: ["'Fira Code'", "monospace"], // If using monospaced fonts
      },
    },
  },
  plugins: [],
}
