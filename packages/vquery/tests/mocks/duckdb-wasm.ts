// Mock module for @duckdb/duckdb-wasm

export const AsyncDuckDB = rs.fn().mockImplementation(() => ({
  instantiate: rs.fn(),
  connect: rs.fn().mockResolvedValue({
    query: rs.fn().mockResolvedValue({
      toArray: () => [],
    }),
    close: rs.fn(),
  }),
  terminate: rs.fn(),
  registerFileBuffer: rs.fn(),
}))

export const selectBundle = rs.fn().mockResolvedValue({
  mainModule: 'mock-module',
  mainWorker: 'mock-worker',
  pthreadWorker: 'mock-pthread',
})

export const ConsoleLogger = rs.fn()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DuckDBBundles = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncDuckDBConnection = any
