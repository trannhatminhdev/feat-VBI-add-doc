import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './quantile.json'

describe('Select Aggregation Quantile Example', () => {
  it('Select Aggregation Quantile Example', async () => {
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

    // quantile usually defaults to median or requires argument.
    // If it fails, we will adjust expectation or implementation.
    // Assuming default behavior or simple existence for now.
    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "salary_quantile": 6000,
        },
      ]
    `)
  })
})
