/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: 'var(--ant-color-primary)',
      'primary-hover': 'var(--ant-color-primary-hover)',
      'ant-color-border': 'var(--ant-color-border)'
    },
    extend: {}
  },
  plugins: []
}
