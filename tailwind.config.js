/** @type {import('tailwindcss').Config} */

function varColor(name) {
  return `rgb(var(--${name}) / <alpha-value>)`;
}

function colorScale(prefix, shades) {
  return Object.fromEntries(shades.map((s) => [s, varColor(`${prefix}-${s}`)]));
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colorScale('gray', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        primary: colorScale('primary', [300, 400, 500, 600]),
        accent: colorScale('accent', [400, 500]),
        green: colorScale('green', [400, 500]),
        purple: colorScale('purple', [400, 500]),
        red: { 400: varColor('red-400') },
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        twinkle: 'twinkle 8s infinite',
      },
    },
  },
  plugins: [],
}

