/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidad visual Pucón Inmobiliaria
        ink: {
          950: '#0b1011', // background principal (más profundo)
          900: '#111718', // background principal
          800: '#171e20', // card fondo
          700: '#1d262a',
          600: '#2a3236',
          500: '#3a4448',
        },
        teal: {
          400: '#3ee0e0',
          450: '#22d3d3',
          500: '#0fc8c8',
          550: '#06b6b6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 20% 20%, rgba(34,211,211,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(34,211,211,0.10), transparent 50%)',
        'gradient-teal': 'linear-gradient(135deg, #22d3d3 0%, #0fc8c8 50%, #06b6b6 100%)',
        'gradient-text': 'linear-gradient(180deg, #ffffff 0%, #c4f0f0 100%)',
      },
      boxShadow: {
        'glow-teal-sm': '0 0 12px rgba(34,211,211,0.35)',
        'glow-teal': '0 0 28px rgba(34,211,211,0.45)',
        'glow-teal-lg': '0 0 60px rgba(34,211,211,0.30)',
        'card': '0 1px 0 rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.5)',
        'card-hover': '0 1px 0 rgba(34,211,211,0.20), 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(34,211,211,0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
