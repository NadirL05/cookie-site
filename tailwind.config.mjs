/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        forest: 'var(--color-forest)',
        cream: 'var(--color-cream)',
        gold: 'var(--color-gold)',
        'forest-deep': 'var(--color-forest-deep)',
        'gold-muted': 'var(--color-gold-muted)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Noto Serif"', 'serif'],
      },
    },
  },
  plugins: [],
};
