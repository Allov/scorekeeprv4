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
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'ping-once': 'ping-small .1s linear'
      },
      keyframes: {
        'ping-small': {
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: 1
           }
        }
      }
    },
  },
  plugins: [],
}
