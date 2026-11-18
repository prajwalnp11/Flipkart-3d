/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: '#2874F0',
          darkBlue: '#0053C2',
          lightBlue: '#EAF3FF',
          yellow: '#FFE500',
          orange: '#FB641B',
          bg: '#F5F8FE',
          card: '#FFFFFF',
          grey: '#EEF2F7',
          navy: '#172B4D',
          border: '#D8E2EC',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 4px 20px rgba(40, 116, 240, 0.35)',
        'glow-yellow': '0 4px 20px rgba(255, 229, 0, 0.45)',
        'glass-light': '0 8px 30px rgba(15, 23, 42, 0.08)',
        'glass-card': '0 4px 20px rgba(0, 83, 194, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
