import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': '#0F172A',
        'slate': {
          '950': '#0F172A',
          '900': '#0F172A',
          '850': '#1A202C',
          '800': '#1E293B',
          '700': '#334155',
          '600': '#475569',
          '500': '#64748B',
          '400': '#94A3B8',
          '300': '#CBD5E1',
          '200': '#E2E8F0',
          '100': '#F1F5F9',
          '50': '#F8FAFC',
        },
      },
      fontFamily: {
        'sans': ['Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['Geist Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500': {},
        },
        '.btn-primary': {
          '@apply bg-gradient-to-r from-blue-600 to-blue-500 text-white active:scale-95 shadow-lg hover:shadow-lg': {},
        },
        '.btn-secondary': {
          '@apply bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 active:scale-95': {},
        },
        '.btn-ghost': {
          '@apply text-slate-300 hover:text-white hover:bg-slate-800/50 active:scale-95': {},
        },
        '.card': {
          '@apply bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all': {},
        },
        '.card-interactive': {
          '@apply bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer hover:border-blue-500/50 hover:shadow-lg': {},
        },
        '.glass': {
          '@apply bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl': {},
        },
        '.gradient-text': {
          '@apply bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent': {},
        },
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply bg-blue-500/20 text-blue-300 border border-blue-500/30': {},
        },
        '.badge-success': {
          '@apply bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': {},
        },
        '.badge-warning': {
          '@apply bg-amber-500/20 text-amber-300 border border-amber-500/30': {},
        },
        '.badge-error': {
          '@apply bg-rose-500/20 text-rose-300 border border-rose-500/30': {},
        },
        '.section': {
          '@apply space-y-4': {},
        },
        '.section-title': {
          '@apply text-lg font-semibold text-slate-100 uppercase tracking-wider': {},
        },
      })
    },
  ],
} satisfies Config
