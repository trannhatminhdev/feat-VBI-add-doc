import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './in_operator.json'

describe('Where with IN / NOT IN Operator', () => {
  it('Where with IN / NOT IN Operator', async () => {
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
          "age": 25,
          "gender": "female",
          "id": 1,
          "name": "Alice",
        },
        {
          "age": 30,
          "gender": "male",
          "id": 2,
          "name": "Bob",
        },
        {
          "age": 22,
          "gender": "female",
          "id": 5,
          "name": "Eve",
        },
      ]
    `)
  })
})
