import { Dataset } from '@visactor/vquery'
import { QueryAdapter, StorageAdapter, DatasetSource } from '@visactor/vquery'
import { QueryResult } from 'src/types/DataSet'
import { DatasetSchema } from 'src/types/DataSet'

class MockQueryAdapter implements QueryAdapter {
  open = async () => {}
  close = async () => {}
  writeFile = async () => {}
  query = async (): Promise<QueryResult & { table: unknown }> => ({ dataset: [], table: {} })
  getSchema = async () => []
}

class MockStorageAdapter implements StorageAdapter {
  private datasets = new Map<
    string,
    { datasetId: string; datasetSchema: DatasetSchema; datasetSource?: DatasetSource }
  >()
  open = async () => {}
  close = async () => {}
  writeDataset = async (id: string, schema: DatasetSchema, source?: DatasetSource) => {
    this.datasets.set(id, { datasetId: id, datasetSchema: schema, datasetSource: source })
  }
  readDataset = async (id: string) => this.datasets.get(id) || null
  deleteDataset = async (id: string) => {
    this.datasets.delete(id)
  }
  listDatasets = async () => Array.from(this.datasets.values())
}

describe('Dataset', () => {
  let dataset: Dataset
  let queryAdapter: MockQueryAdapter
  let storageAdapter: MockStorageAdapter
  const datasetId = 'test_dataset'

  beforeEach(() => {
    queryAdapter = new MockQueryAdapter()
    storageAdapter = new MockStorageAdapter()
    dataset = new Dataset(queryAdapter, storageAdapter, datasetId)
  })

  it('should throw error when initializing non-existent dataset', async () => {
    await expect(dataset.init()).rejects.toThrow(`Dataset ${datasetId} not found`)
  })

  it('should initialize with existing dataset', async () => {
    await storageAdapter.writeDataset(
      datasetId,
      { datasetId, datasetAlias: datasetId, columns: [] },
      { type: 'csv', blob: new Blob([]) },
    )
    await expect(dataset.init()).resolves.not.toThrow()
  })

  it('should handle unsupported data source type', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source: DatasetSource = { type: 'unknown' as any, blob: new Blob([]) }
    await expect(dataset.createOrReplaceView([], source)).rejects.toThrow('Unsupported dataSource type: unknown')
  })

  it('should skip view creation if source is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(dataset.createOrReplaceView([], undefined as any)).resolves.not.toThrow()
  })
})
