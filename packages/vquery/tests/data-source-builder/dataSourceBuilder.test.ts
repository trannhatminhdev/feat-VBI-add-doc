import { DatasetSourceBuilder } from '@visactor/vquery'
import { RawDatasetSource } from '@visactor/vquery'

describe('DatasetSourceBuilder', () => {
  it('should handle Blob input', async () => {
    const blob = new Blob(['test'], { type: 'text/csv' })
    const source: RawDatasetSource = { type: 'csv', rawDataset: blob }
    const result = await DatasetSourceBuilder.from(source).build()
    expect(result.blob).toBe(blob)
  })

  it('should handle URL input', async () => {
    const mockBlob = new Blob(['test'], { type: 'text/csv' })
    const originalFetch = global.fetch
    global.fetch = async () =>
      ({
        blob: async () => mockBlob,
        arrayBuffer: async () => new ArrayBuffer(4),
      }) as unknown as Response

    const source: RawDatasetSource = { type: 'csv', rawDataset: 'http://example.com/data.csv' }
    const result = await DatasetSourceBuilder.from(source).build()
    expect(result.blob).toBe(mockBlob)
    global.fetch = originalFetch
  })

  it('should handle ArrayBuffer input', async () => {
    const buffer = new ArrayBuffer(8)
    const source: RawDatasetSource = { type: 'csv', rawDataset: buffer }
    const result = await DatasetSourceBuilder.from(source).build()
    expect(result.blob).toBeInstanceOf(Blob)
    expect(result.blob.size).toBe(8)
  })

  it('should handle Object input', async () => {
    const data = [{ a: 1 }]
    const source: RawDatasetSource = { type: 'json', rawDataset: data }
    const result = await DatasetSourceBuilder.from(source).build()
    expect(result.blob).toBeInstanceOf(Blob)
    const text = await result.blob.text()
    expect(text).toBe(JSON.stringify(data))
  })

  it('should handle string input as raw content', async () => {
    const data = 'a,b\n1,2'
    const source: RawDatasetSource = { type: 'csv', rawDataset: data }
    const result = await DatasetSourceBuilder.from(source).build()
    expect(result.blob).toBeInstanceOf(Blob)
    const text = await result.blob.text()
    expect(text).toBe(data)
  })
})
