// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|input|modal|slider|tabs|toast|ripple|spinner|form|popover).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cursive': ['var(--font-dancing-script)', 'Dancing Script', 'cursive'],
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
};
