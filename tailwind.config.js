/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens - resolved from CSS variables in globals.css
        // so light/dark never needs a `dark:` twin for colour.
        canvas: 'rgb(var(--canvas-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          sunk: 'var(--surface-sunk)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
        },
        signal: {
          DEFAULT: 'rgb(var(--signal-rgb) / <alpha-value>)',
          solid: 'rgb(var(--signal-solid-rgb) / <alpha-value>)',
          // Constant across themes - for the steel bands, which are dark in both.
          bright: 'rgb(var(--signal-bright-rgb) / <alpha-value>)',
          hover: 'var(--signal-hover)',
          wash: 'var(--signal-wash)',
          edge: 'var(--signal-edge)',
          on: 'var(--on-signal)',
        },
        positive: {
          DEFAULT: 'rgb(var(--positive-rgb) / <alpha-value>)',
          wash: 'var(--positive-wash)',
        },
        negative: 'var(--negative)',
        // Spectrum hues, theme-aware and safe as text on the canvas.
        hue: {
          violet: 'rgb(var(--hue-violet-rgb) / <alpha-value>)',
          blue: 'rgb(var(--hue-blue-rgb) / <alpha-value>)',
          teal: 'rgb(var(--hue-teal-rgb) / <alpha-value>)',
          green: 'rgb(var(--hue-green-rgb) / <alpha-value>)',
          amber: 'rgb(var(--hue-amber-rgb) / <alpha-value>)',
        },
        // The same hues, lifted for the dark steel bands. Constant.
        glow: {
          violet: '#b794f6',
          blue: '#7cb4ff',
          teal: '#3ee0d0',
          green: '#9be15d',
          amber: '#fde725',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        script: ['var(--font-script)', 'Great Vibes', 'Segoe Script', 'cursive'],
      },
      fontSize: {
        // A real scale. Nothing below 12px carries meaning.
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em' }],
        micro: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.8125rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.75' }],
        lead: ['1.125rem', { lineHeight: '1.7' }],
        h3: ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        h2: ['1.625rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        h1: ['2.25rem', { lineHeight: '1.12', letterSpacing: '-0.03em' }],
        display: ['3.25rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      maxWidth: {
        prose: '68ch',
      },
      spacing: {
        // Room to breathe between sections - scales down on phones.
        section: 'clamp(5.5rem, 11vw, 9rem)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
