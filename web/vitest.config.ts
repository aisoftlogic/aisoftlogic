import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    // ✅ same environment & setup as before
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/__tests__/**/*.{test,spec}.tsx'],
    exclude: ['node_modules', 'dist', '.next'],

    // ✅ helpful defaults that don't change your test logic
    globals: true,
    testTimeout: 15000,
    hookTimeout: 10000,
    // make tests more deterministic between runs
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    // speed up watch mode by ignoring build outputs
    watchExclude: ['**/dist/**', '**/.next/**', '**/coverage/**'],

    // stable URL for code that relies on window.location
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },

    // lightweight coverage out of the box
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '.next/**',
        'src/__tests__/**',
        '**/*.d.ts',
      ],
    },
  },
})