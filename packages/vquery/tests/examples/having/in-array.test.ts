import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { convertDSLToSQL, VQuery } from '@visactor/vquery'
import vqueryConfig from './in-array.json'

describe('Having Example with array IN operator', () => {
  it('Having Example with array IN operator', async () => {
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
      `"select "department", sum("salary") as "Total Salary" from "having-in-array" group by "department" having ("department" in ('HR', 'Engineering'))"`,
    )

    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "Total Salary": 11000,
          "department": "HR",
        },
        {
          "Total Salary": 17000,
          "department": "Engineering",
        },
      ]
    `)
  })
})
