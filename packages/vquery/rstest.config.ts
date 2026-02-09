import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: true,
  testEnvironment: 'node',
  includeSource: ['src/**/*.{js,ts}'],
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    enabled: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['src/**'],
    reporters: ['html', ['text', { skipFull: true }], 'json', 'json-summary'],
    thresholds: {
      statements: 95,
      lines: 95,
    },
  },
  resolve: {
    alias: {
      '@visactor/vquery': ['./src/node'],
      '@visactor/vquery/browser': ['./src/browser'],
      'src/*': ['./src/*'],
    },
  },
})
