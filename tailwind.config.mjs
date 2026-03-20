import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:       '#FFFAF5',
        sand:        '#F2E9DE',
        'sand-dark': '#E8DDD3',
        gold:        '#D4C4A8',
        'gold-muted':'#C4B59A',
        accent:      '#8B7355',
        'accent-light':'#9C8B74',
        brown:       '#5C4A35',
        'brown-dark':'#3D2E1F',
      },
      fontFamily: {
        serif:  ['"Cormorant Garamond"', ...defaultTheme.fontFamily.serif],
        sans:   ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem',  { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display':    ['2.5rem',  { lineHeight: '1.2' }],
        'display-sm': ['2rem',    { lineHeight: '1.25' }],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
        'ultra-wide':  '0.3em',
      },
      maxWidth: {
        'content': '72rem',
        'narrow':  '48rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};
