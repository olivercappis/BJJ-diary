/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // BJJ-themed colors
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fc',
          400: '#7f8ff8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Belt colors
        belt: {
          white: '#ffffff',
          blue: '#1e40af',
          purple: '#7c3aed',
          brown: '#78350f',
          black: '#171717',
        },
        // App background colors
        background: {
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
