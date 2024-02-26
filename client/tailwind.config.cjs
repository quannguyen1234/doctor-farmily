const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: '#7facff',
      error: 'rgb(244 63 94)',
      bluePrimary: '#0057ff',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      rose: colors.rose,
      indigo: colors.indigo
    },
    extend: {
      boxShadow: {
        md: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        xl: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
        xxl: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;'
      }
    }
  },
  plugins: []
};
