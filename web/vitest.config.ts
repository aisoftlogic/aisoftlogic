import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/__tests__/**/*.{test,spec}.tsx'],
    exclude: ['node_modules', 'dist', '.next'],
    globals: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})