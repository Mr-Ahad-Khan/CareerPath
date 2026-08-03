/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        foreground: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--accent-strong) / <alpha-value>)',
        'accent-contrast': 'rgb(var(--accent-contrast) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / 0.25), 0 8px 40px -12px rgb(var(--accent) / 0.45)',
        panel: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 20px 50px -30px rgb(0 0 0 / 0.8)',
        lift: '0 18px 40px -24px rgb(0 0 0 / 0.7)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-flat': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'draw-line': {
          from: { strokeDashoffset: 'var(--len, 1000)' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in-flat': 'fade-in-flat 0.4s ease both',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
