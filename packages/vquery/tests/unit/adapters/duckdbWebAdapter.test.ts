/* eslint-disable @typescript-eslint/no-explicit-any */
import { DuckDBWebQueryAdapter, getDefaultBundles } from 'src/adapters/query-adapter/duckdbWebAdapter'
import type { DuckDBBundles } from '@duckdb/duckdb-wasm'

// Mock dependencies
const mockConnection = {
  query: rs.fn(),
  close: rs.fn(),
}

const mockDB = {
  instantiate: rs.fn(),
  connect: rs.fn().mockResolvedValue(mockConnection),
  terminate: rs.fn(),
  registerFileBuffer: rs.fn(),
}

rs.mock('@duckdb/duckdb-wasm', () => {
  return {
    AsyncDuckDB: rs.fn().mockImplementation(() => mockDB),
    selectBundle: rs.fn().mockResolvedValue({
      mainModule: 'mock-module',
      mainWorker: 'mock-worker',
      pthreadWorker: 'mock-pthread',
    }),
    ConsoleLogger: rs.fn(),
  }
})

describe('DuckDBWebQueryAdapter', () => {
  let adapter: DuckDBWebQueryAdapter

  beforeAll(() => {
    // Mock global Worker
    global.Worker = class MockWorker {
      constructor() {}
      terminate() {}
      postMessage() {}
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return true
      }
    } as any

    // Mock global URL
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = rs.fn().mockReturnValue('blob:mock-url')
    }
    if (!global.URL.revokeObjectURL) {
      global.URL.revokeObjectURL = rs.fn()
    }
  })

  beforeEach(() => {
    // Create adapter with mock bundles to avoid loading actual wasm files
    const mockBundles: DuckDBBundles = {
      mvp: {
        mainModule: 'mock-mvp.wasm',
        mainWorker: 'mock-mvp.worker.js',
      },
      eh: {
        mainModule: 'mock-eh.wasm',
        mainWorker: 'mock-eh.worker.js',
      },
    }
    adapter = new DuckDBWebQueryAdapter(mockBundles)
    rs.clearAllMocks()

    mockConnection.query.mockResolvedValue({
      toArray: () => [],
    })
  })

  afterEach(async () => {
    await adapter.close()
  })

  it('should open connection', async () => {
    await adapter.open()
    expect(mockDB.instantiate).toHaveBeenCalled()
    expect(mockDB.connect).toHaveBeenCalled()
  })

  it('should query data', async () => {
    await adapter.open()
    const mockTable = {
      toArray: () => [{ toJSON: () => ({ id: 1 }) }],
    }
    mockConnection.query.mockResolvedValue(mockTable)

    const result = await adapter.query('SELECT 1')
    expect(result.dataset).toEqual([{ id: 1 }])
    expect(mockConnection.query).toHaveBeenCalledWith('SELECT 1')
  })

  it('should get schema', async () => {
    await adapter.open()
    const mockTable = {
      toArray: () => [{ toJSON: () => ({ name: 'id', type: 'INTEGER' }) }],
    }
    mockConnection.query.mockResolvedValue(mockTable)

    const schema = await adapter.getSchema('test')
    expect(schema).toEqual([{ name: 'id', type: 'INTEGER' }])
    expect(mockConnection.query).toHaveBeenCalledWith("PRAGMA table_info('test')")
  })

  it('should write file', async () => {
    await adapter.open()
    const blob = new Blob(['test'])
    await adapter.writeFile('test.csv', blob)
    expect(mockDB.registerFileBuffer).toHaveBeenCalled()
  })

  it('should throw error when query without connection', async () => {
    await expect(adapter.query('SELECT 1')).rejects.toThrow('connection is null')
  })

  it('should throw error when writing file without db', async () => {
    await expect(adapter.writeFile('test.csv', new Blob([]))).rejects.toThrow('db is null')
  })

  it('should throw error when writing unsupported source type', async () => {
    await adapter.open()
    // @ts-expect-error testing unsupported type
    await expect(adapter.writeFile('test.csv', 'string')).rejects.toThrow('Unsupported source type')
  })

  it('should throw error when getting schema without connection', async () => {
    await expect(adapter.getSchema('test')).rejects.toThrow('connection is null')
  })
})

describe('getDefaultBundles', () => {
  let originalURL: typeof URL

  beforeAll(() => {
    originalURL = global.URL
  })

  afterAll(() => {
    global.URL = originalURL
  })

  it('should return default bundles with correct paths', () => {
    // Mock URL to intercept constructor calls
    const MockURL = rs.fn((path: string) => ({
      href: `resolved:${path}`,
      toString: () => `resolved:${path}`,
    })) as unknown as typeof URL

    global.URL = MockURL

    const bundles = getDefaultBundles()

    expect(bundles.mvp.mainModule).toBe('resolved:@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm')
    expect(bundles.mvp.mainWorker).toBe('resolved:@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js')
    expect(bundles.eh!.mainModule).toBe('resolved:@duckdb/duckdb-wasm/dist/duckdb-eh.wasm')
    expect(bundles.eh!.mainWorker).toBe('resolved:@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js')
  })
})
