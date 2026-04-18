/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1e3a8a',
          vibrant: '#2563eb',
          light: '#3b82f6',
          dark: '#172554',
        },
        accent: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.8)',
          card: '#ffffff',
          dark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'vibrant': '0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 10px 10px -5px rgba(37, 99, 235, 0.04)',
      }
    },
  },
  plugins: [],
}
