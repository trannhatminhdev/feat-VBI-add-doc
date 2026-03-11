import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: true,
  testEnvironment: 'node',
  setupFiles: ['./tests/rstest.setup.ts'],
  includeSource: ['src/**/*.{js,ts}'],
  coverage: {
    enabled: false,
  },
  resolve: {
    alias: {
      '@visactor/vbi': ['./src'],
    },
  },
})
