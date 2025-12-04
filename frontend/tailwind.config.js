/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        ocean: '#0284c7',
        lime: '#84cc16',
        amber: '#fbbf24',
        coral: '#fb7185',
      },
    },
  },
  plugins: [],
};
