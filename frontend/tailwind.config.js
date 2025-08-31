/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "my": "352px",
        "mm": "359px",
        "ml": "425px",
      },
    },
  },
  plugins: [],
}

