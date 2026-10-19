/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          bg: '#0B0F19',
          surface: '#111827',
          surfaceHover: '#1F2937',
          border: '#334155',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          goldLight: '#FDE68A',
          goldDark: '#B45309',
          purple: '#A855F7',
          purpleDark: '#7E22CE',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'glow-gold': 'glowGold 2s ease-in-out infinite alternate',
        'dash-march': 'dashMarch 1.2s linear infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { filter: 'drop-shadow(0 0 4px #06B6D4)' },
          '100%': { filter: 'drop-shadow(0 0 16px #06B6D4) drop-shadow(0 0 24px #22D3EE)' },
        },
        glowGold: {
          '0%': { filter: 'drop-shadow(0 0 4px #F59E0B)' },
          '100%': { filter: 'drop-shadow(0 0 16px #F59E0B)' },
        },
        dashMarch: {
          to: { strokeDashoffset: '-24' },
        },
      },
    },
  },
  plugins: [],
}
