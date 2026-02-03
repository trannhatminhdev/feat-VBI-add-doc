import { DuckDBNodeQueryAdapter } from '@visactor/vquery'

describe('DuckDBNodeQueryAdapter', () => {
  let adapter: DuckDBNodeQueryAdapter

  beforeEach(() => {
    adapter = new DuckDBNodeQueryAdapter()
  })

  afterEach(async () => {
    await adapter.close()
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
    await expect(adapter.writeFile('test.csv', 'string' as unknown as Blob)).rejects.toThrow('Unsupported source type')
  })

  it('should close successfully even if not opened', async () => {
    await expect(adapter.close()).resolves.not.toThrow()
  })

  it('should close successfully multiple times', async () => {
    await adapter.open()
    await adapter.close()
    await expect(adapter.close()).resolves.not.toThrow()
  })

  it('should get schema', async () => {
    await adapter.open()
    await adapter.writeFile('test.csv', new Blob(['a,b\n1,2'], { type: 'text/csv' }))
    await adapter.query("CREATE OR REPLACE VIEW test AS SELECT * FROM read_csv_auto('test.csv')")
    const schema = await adapter.getSchema('test')
    expect(schema).toBeDefined()
    expect(schema.length).toBeGreaterThan(0)
    expect(schema[0].name).toBe('a')
  })
})
