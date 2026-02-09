import { DuckDBWebQueryAdapter } from 'src/adapters/query-adapter/duckdbWebAdapter'
import { IndexedDBAdapter } from 'src/adapters/storage-adapter/indexeddbAdapter'

// Mock dependencies
const mockDuckDBAdapter = {
  open: rs.fn(),
  close: rs.fn(),
  query: rs.fn(),
  getSchema: rs.fn(),
  writeFile: rs.fn(),
}

const mockStorageAdapter = {
  open: rs.fn(),
  close: rs.fn(),
  readDataset: rs.fn(),
  writeDataset: rs.fn(),
  deleteDataset: rs.fn(),
  listDatasets: rs.fn(),
}

rs.mock('src/adapters/query-adapter/duckdbWebAdapter', () => {
  return {
    DuckDBWebQueryAdapter: rs.fn().mockImplementation(() => mockDuckDBAdapter),
  }
})

rs.mock('src/adapters/storage-adapter/indexeddbAdapter', () => {
  return {
    IndexedDBAdapter: rs.fn().mockImplementation(() => mockStorageAdapter),
  }
})

// Import VQuery after mocking dependencies
import { VQuery } from 'src/vquery-browser'

describe('VQuery Browser', () => {
  beforeEach(() => {
    rs.clearAllMocks()
  })

  it('should initialize with correct adapters', () => {
    const vquery = new VQuery()

    expect(vquery).toBeDefined()
    expect(DuckDBWebQueryAdapter).toHaveBeenCalledTimes(1)
    expect(IndexedDBAdapter).toHaveBeenCalledTimes(1)
  })
})
