import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { convertDSLToSQL, VQuery } from '@visactor/vquery'
import vqueryConfig from './quantile.json'

describe('Select Quantile Example', () => {
  it('Select Quantile Example', async () => {
    const vquery = new VQuery()
    const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    if (!(await vquery.hasDataset(datasetId))) {
      await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
    }

    const dataset = await vquery.connectDataset(datasetId)

    const sql = convertDSLToSQL(vqueryDSL as VQueryDSL<Record<string, string | number>>, datasetId)

    expect(sql).toMatchInlineSnapshot(
      `"select quantile("salary", 0.9) as "salary_quantile" from "select-aggregation-quantile""`,
    )

    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "salary_quantile": 9000,
        },
      ]
    `)
  })
})
