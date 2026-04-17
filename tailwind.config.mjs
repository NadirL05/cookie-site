/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        forest: 'var(--color-forest)',
        cream: 'var(--color-cream)',
        gold: 'var(--color-gold)',
        'forest-mid': 'var(--color-forest-mid)',
        brown: 'var(--color-brown)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
