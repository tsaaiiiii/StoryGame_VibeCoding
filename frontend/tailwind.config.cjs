module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        milk: '#F8F3ED',
        cream: '#FFF9F2',
        sand: '#E8DCCF',
        cocoa: '#3F352B',
        cocoaMuted: '#5C5145',
        latte: '#D4A373',
        latteHover: '#C58E60',
        mist: '#DED3C6',
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans TC"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        latte: '0 8px 24px rgba(0, 0, 0, 0.04)',
        latteSoft: '0 4px 12px rgba(0, 0, 0, 0.03)',
      },
      transitionTimingFunction: {
        'soft-ease': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
