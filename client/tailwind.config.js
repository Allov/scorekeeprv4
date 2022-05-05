module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx,png}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'card': [
            '5px 5px 2px rgba(0, 0, 0, .1)',
            '5px 5px 2px rgba(0, 0, 0, .1)'
        ]
      }
    },
  },
  plugins: [],
}
