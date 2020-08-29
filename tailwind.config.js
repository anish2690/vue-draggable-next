module.exports = {
  purge: {
    content: [

    ],
    options: {
      extractors: [
        {
          extensions: ['vue'],
        },
      ],
    },
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
