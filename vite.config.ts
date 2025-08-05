const path = require('path')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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
  define: {
    // Vue 3 feature flags for proper tree-shaking and development
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Disable hydration mismatch details in production
    __VUE_OPTIONS_API__: true, // Enable Options API support
    __VUE_PROD_DEVTOOLS__: false, // Disable devtools in production
    __VUE_PROD_WARN__: false, // Disable warnings in production
  },
})
