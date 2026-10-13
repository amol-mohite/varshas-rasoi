/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EF',
        creamdark: '#FFF2E0',
        brand: {
          brown: '#3E2622',
          brownlight: '#6B4A3F',
          terra: '#C73D13',
          terrahover: '#B2350F',
          mustard: '#F9A724',
          mustardhover: '#E89B1E',
          muted: '#8D7062',
        },
        veg: '#22A65A',
        nonveg: '#E24545',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(62, 38, 34, 0.08)',
        cardhover: '0 8px 28px rgba(62, 38, 34, 0.14)',
        floatbar: '0 8px 28px rgba(62, 38, 34, 0.22)',
      },
    },
  },
  plugins: [],
};
