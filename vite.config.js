import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/',

  build: {
    outDir: 'dist',
  },

  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@engine': path.resolve(__dirname, './src/engine'),
      '@particles': path.resolve(__dirname, './src/particles'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
