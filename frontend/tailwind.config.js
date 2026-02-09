/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'surface-dark': '#05050a',
          'surface-elevated': '#0b0b13',
          'surface-muted': '#11111b',
          'surface-soft': '#181826',
          'ink-primary': '#f9fafb',
          'ink-muted': '#9ca3af',
          'accent-indigo': '#6366f1',
          'accent-violet': '#8b5cf6',
          'accent-emerald': '#10b981',
        },
        boxShadow: {
          'soft-lg': '0 24px 60px rgba(0,0,0,0.55)',
          'soft-inner': 'inset 0 1px 0 rgba(255,255,255,0.02)',
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.25rem',
          '3xl': '1.75rem',
        },
        backgroundImage: {
          'hero-orbit':
            'radial-gradient(circle at 0% 0%, rgba(129,140,248,0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(45,212,191,0.12), transparent 55%)',
          'panel-glass':
            'linear-gradient(135deg, rgba(15,23,42,0.88), rgba(15,23,42,0.72))',
        },
      },
    },
    plugins: [],
  }
