module.exports = {
  purge: [
    './demo/**/*.html',
    './demo/**/*.vue',
    './demo/**/*.ts'
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
