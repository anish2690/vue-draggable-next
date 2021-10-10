const path = require('path')
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [vue()],
  root: 'demo',
  build: {
    outDir: 'demo_dist',
  },
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['sortablejs'],
  },
})
