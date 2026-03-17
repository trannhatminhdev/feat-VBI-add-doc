import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { convertDSLToSQL, VQuery } from '@visactor/vquery'
import vqueryConfig from './count_distinct.json'

describe('Select Count Distinct Example', () => {
  it('Select Count Distinct Example', async () => {
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
      `"select CAST(count(distinct "department") AS INTEGER) as "distinct_departments" from "select-aggregation-count-distinct""`,
    )

    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "distinct_departments": 3,
        },
      ]
    `)
  })
})
