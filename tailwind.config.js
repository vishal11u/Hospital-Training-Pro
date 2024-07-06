/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '5px',
            // height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0aec0',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#edf2f7',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '5px',
            // height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0aec0',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#edf2f7',
          },
        },
        '.scrollbar-rounded': {
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '9999px',
          },
        },
      })
    }
  ],
}
