import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      brand: {
        50: '#e8f8f5',
        100: '#c9f0e9',
        200: '#96e1d4',
        300: '#5fcdbb',
        400: '#2fb6a1',
        500: '#018d71',
        600: '#017a62',
        700: '#036352',
        800: '#064f43',
        900: '#063f37',
      },
    },
  },
  shortcuts: {
    'page-container': 'mx-auto w-full max-w-1200px px-5',
    'card-base': 'rounded-3 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-16px_rgba(16,24,40,0.18)]',
    'text-muted': 'text-[#7b8188]',
    'text-subtle': 'text-[#9aa0a6]',
  },
})
