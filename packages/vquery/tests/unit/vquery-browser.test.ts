import { VQuery } from '../../src/vquery-browser'
import { DuckDBWebQueryAdapter } from '../../src/adapters/query-adapter/duckdbWebAdapter'
import { IndexedDBAdapter } from '../../src/adapters/storage-adapter/indexeddbAdapter'
// Mock the dependencies
rs.mock('../../src/adapters/query-adapter/duckdbWebAdapter', () => {
  return {
    DuckDBWebQueryAdapter: rs.fn(),
  }
})
rs.mock('../../src/adapters/storage-adapter/indexeddbAdapter', () => {
  return {
    IndexedDBAdapter: rs.fn(),
  }
})

describe('VQuery Browser', () => {
  beforeEach(() => {
    // rs.clearAllMocks() // Assuming this exists or similar
  })

  it('should initialize with correct adapters', () => {
    const vquery = new VQuery()

    expect(vquery).toBeDefined()
    expect(DuckDBWebQueryAdapter).toHaveBeenCalledTimes(1)
    expect(IndexedDBAdapter).toHaveBeenCalledTimes(1)
  })
})
