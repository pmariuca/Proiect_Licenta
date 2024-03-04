/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'wide': '1950px',
        'desktop': {'max': '1440px',},
        'laptop': {'max': '1200px',},
        'm-tablet': {'max': '990px',},
        'tablet': {'max': '640px',},
        'mobile': {'max': '380px',},
      },
    },
  },
  plugins: [],
}

