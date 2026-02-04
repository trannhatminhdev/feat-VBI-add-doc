/* eslint-disable @typescript-eslint/no-explicit-any */
import { DuckDBNodeQueryAdapter } from 'src/adapters/query-adapter/duckdbNodeAdapter'
import { createDuckDB } from '@duckdb/duckdb-wasm/blocking'

rs.mock('@duckdb/duckdb-wasm/blocking', () => {
  return {
    createDuckDB: rs.fn(),
    ConsoleLogger: rs.fn(),
    NODE_RUNTIME: {},
  }
})

describe('DuckDBNodeQueryAdapter', () => {
  let adapter: DuckDBNodeQueryAdapter
  let mockBindings: any
  let mockConnection: any

  beforeEach(() => {
    mockConnection = {
      query: rs.fn().mockResolvedValue({
        toArray: () => [],
      }),
      close: rs.fn(),
    }

    mockBindings = {
      instantiate: rs.fn().mockImplementation((cb) => {
        if (cb) cb()
        return Promise.resolve()
      }),
      open: rs.fn(),
      connect: rs.fn().mockReturnValue(mockConnection),
      reset: rs.fn(),
      registerFileBuffer: rs.fn(),
    }

    // Setup mock return value
    ;(createDuckDB as any).mockResolvedValue(mockBindings)

    adapter = new DuckDBNodeQueryAdapter()
    rs.clearAllMocks()
  })

  afterEach(async () => {
    await adapter.close()
  })

  it('should open connection', async () => {
    await adapter.open()
    expect(mockBindings.instantiate).toHaveBeenCalled()
    expect(mockBindings.open).toHaveBeenCalled()
    expect(mockBindings.connect).toHaveBeenCalled()
  })

  it('should throw error when writing file without bindings', async () => {
    await expect(adapter.writeFile('test.csv', new Blob([]))).rejects.toThrow('bindings is null')
  })

  it('should throw error when querying without connection', async () => {
    await expect(adapter.query('SELECT 1')).rejects.toThrow('connection is null')
  })

  it('should throw error when getting schema without connection', async () => {
    await expect(adapter.getSchema('test.csv')).rejects.toThrow('connection is null')
  })

  it('should throw error when writing unsupported file type', async () => {
    await adapter.open()
    // @ts-expect-error testing unsupported type
    await expect(adapter.writeFile('test.csv', 'string')).rejects.toThrow('Unsupported source type')
  })

  it('should close successfully even if not opened', async () => {
    await expect(adapter.close()).resolves.not.toThrow()
  })

  it('should close successfully multiple times', async () => {
    await adapter.open()
    await adapter.close()
    expect(mockConnection.close).toHaveBeenCalled()
    expect(mockBindings.reset).toHaveBeenCalled()
    await expect(adapter.close()).resolves.not.toThrow()
  })

  it('should get schema', async () => {
    await adapter.open()
    const mockSchema = [{ name: 'a', type: 'VARCHAR' }]
    mockConnection.query.mockResolvedValue({
      toArray: () => [{ toJSON: () => mockSchema[0] }],
    })

    const schema = await adapter.getSchema('test')
    expect(schema).toBeDefined()
    expect(schema.length).toBeGreaterThan(0)
    expect(schema[0].name).toBe('a')
    expect(mockConnection.query).toHaveBeenCalledWith("PRAGMA table_info('test')")
  })

  it('should query data', async () => {
    await adapter.open()
    const mockData = [{ id: 1, val: 10 }]
    mockConnection.query.mockResolvedValue({
      toArray: () => [{ toJSON: () => mockData[0] }],
    })

    const result = await adapter.query('SELECT * FROM test')
    expect(result.dataset).toHaveLength(1)
    expect(result.dataset[0]).toEqual(mockData[0])
  })

  it('should write file', async () => {
    await adapter.open()
    const blob = new Blob(['test'])
    await adapter.writeFile('test.csv', blob)
    expect(mockBindings.registerFileBuffer).toHaveBeenCalled()
  })
})
