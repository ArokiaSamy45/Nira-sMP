/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(22,119,255)'
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}