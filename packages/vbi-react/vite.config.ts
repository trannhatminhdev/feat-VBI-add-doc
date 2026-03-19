import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: 'node_modules/.vitest',
  test: {
    root: '.',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**', '**/*.d.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
    },
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup-dom.ts'],
    alias: {
      '@visactor/vbi-react': new URL('./src/index.ts', import.meta.url).pathname,
    },
  },
})
