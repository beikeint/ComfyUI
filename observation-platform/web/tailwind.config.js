module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#1d2f6f',
        secondary: '#233a7d',
        accent: '#4fc3f7',
        warning: '#ffb74d',
        success: '#66bb6a',
        info: '#29b6f6'
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(79, 195, 247, 0.35) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
