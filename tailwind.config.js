/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        // Editorial-only — used exclusively on /invite public page and /memory/share
        editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
      },
      colors: {
        pack: {
          bg: '#F7F5F2',
          surface: '#FFFFFF',
          chip: '#F3EFEB',
          hair: '#EDE8E2',
          paper: '#F5EFE8',
          ink: '#2B2420',
          ink2: '#6E6058',
          ink3: '#8E7A6B',
          coral: '#E85D2A',
          coralSoft: '#FF7240',
          coralInk: '#9A5A3E',
        },
      },
    },
  },
  plugins: [],
}

