/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
  extend: {
    colors: {
    surface: '#fffdf5',
    'surface-container': '#fff8e1',
    'surface-container-low': '#fffde7',
    'surface-container-lowest': '#ffffff',
    'surface-container-highest': '#fce282',
    'on-surface': '#1a1200',
    'on-surface-variant': '#4a3f00',
    primary: '#c47f00',
    'on-primary': '#1a1200',
    'primary-container': '#F9C107',
    secondary: '#7a6500',
    'secondary-container': '#fff8c5',
    tertiary: '#e6ac00',
    'tertiary-container': '#ffd740',
    outline: '#c8ad48',
    'outline-variant': '#f0dc80',
    error: '#ba1a1a',
    background: '#fffdf5',
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

