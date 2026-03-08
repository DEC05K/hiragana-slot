/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        sans:  ['"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        bg:              '#f5f4f0',
        surface:         '#ffffff',
        'surface-2':     '#edecea',
        border:          '#d8d5cc',
        'border-strong': '#aaa89f',
        'text-primary':  '#1a1917',
        'text-secondary':'#6b6860',
        'text-muted':    '#a09d97',
        accent:          '#1a1917',
        'accent-hover':  '#383532',
        'reel-bg':       '#fafaf8',
        'reel-border':   '#dedad2',
        'stop-active':   '#e6e2da',
      },
    },
  },
  plugins: [],
}
