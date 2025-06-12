/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0A84FF', // Primary blue
          600: '#006ad6',
          700: '#0050a3',
          800: '#00376f',
          900: '#001b3c',
        },
        secondary: {
          50: '#e6f7fa',
          100: '#cceff5',
          200: '#99dfeb',
          300: '#66cfe1',
          400: '#33bfd7',
          500: '#30B0C7', // Secondary teal
          600: '#268da1',
          700: '#1d6a78',
          800: '#134650',
          900: '#0a2328',
        },
        success: {
          500: '#34C759', // Success green
        },
        warning: {
          500: '#FF9500', // Warning amber
        },
        error: {
          500: '#FF453A', // Error red
        },
        gray: {
          50: '#f7f9fa',
          100: '#eef1f3',
          200: '#dee3e7',
          300: '#cdd5db',
          400: '#bdc7cf',
          500: '#acb8c3',
          600: '#8a939c',
          700: '#676e75',
          800: '#45494e',
          900: '#222527',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};