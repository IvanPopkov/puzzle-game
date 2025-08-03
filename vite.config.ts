/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  test: {},
  base: '/puzzle-game/',
  plugins: [react()],
  resolve: {
    alias: {
      '@utils': '/src/utils',
      '@games': '/src/games',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
    }
  }
})
