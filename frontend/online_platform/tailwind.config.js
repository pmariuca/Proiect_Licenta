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
      colors: {
        'primary': '#0F6CBF',
        'text-primary': '#000000',
        'text-secondary': '#FFFFFF',
        'light-grey': '#F7F7F7',
        'light-green': '#CFEFCF',
        'light-red': '#F4D6D2',
        'footer': '#343A40',
        'question': '#E7F3F5'
      }
    },
    boxShadow: {
      'nav': '0 2px 4px rgba(0,0,0,.08)'
    }
  },
  plugins: [],
}

