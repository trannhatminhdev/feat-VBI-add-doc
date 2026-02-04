import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './basic.json'

describe('Basic OrderBy Example', () => {
  it('Basic OrderBy Example', async () => {
    const vquery = new VQuery()
    const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    if (!(await vquery.hasDataset(datasetId))) {
      await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
    }

    const dataset = await vquery.connectDataset(datasetId)

    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "name": "Charlie",
          "salary": 9000,
        },
        {
          "name": "Bob",
          "salary": 8000,
        },
        {
          "name": "David",
          "salary": 6000,
        },
        {
          "name": "Alice",
          "salary": 5000,
        },
        {
          "name": "Eve",
          "salary": 4000,
        },
      ]
    `)
  })
})
