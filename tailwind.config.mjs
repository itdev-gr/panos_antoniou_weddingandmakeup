import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'off-white':    '#FAFAF8',
        charcoal:       '#2D2D2D',
        grey:           '#555555',
        'forest-green': '#1B4332',
        'green-light':  '#245A3F',
        gold:           '#B8976A',
        'gold-light':   '#D4B88C',
        'near-black':   '#1A1A1A',
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
