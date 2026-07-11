/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
  extend: {
    colors: {
    surface: '#f8f9fa',
    'surface-container': '#efece5',
    'surface-container-low': '#f5f3ee',
    'surface-container-lowest': '#ffffff',
    'surface-container-highest': '#e6e1d6',
    'on-surface': '#1c1917',
    'on-surface-variant': '#57534e',
    primary: '#92400e',
    'on-primary': '#ffffff',
    'primary-container': '#b45309',
    secondary: '#78716c',
    'secondary-container': '#fef3c7',
    tertiary: '#b45309',
    'tertiary-container': '#d97706',
    outline: '#a8a29e',
    'outline-variant': '#e7e0d3',
    error: '#ba1a1a',
    background: '#f8f9fa',
  },
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      lg: '1rem',
      xl: '1.5rem',
    },
  },
},
  plugins: [],
}

