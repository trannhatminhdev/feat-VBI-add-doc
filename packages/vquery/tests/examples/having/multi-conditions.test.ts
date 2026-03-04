import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './multi-conditions.json'

describe('Having with Multiple Conditions', () => {
  it('Having with AND conditions', async () => {
    const vquery = new VQuery()
    const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    if (!(await vquery.hasDataset(datasetId))) {
      await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
    }

    const dataset = await vquery.connectDataset(datasetId)

    // Using having filter: sum(salary) > 5000 AND count > 1
    // HR: sum=11000 (> 5000), count=2 (> 1) ✓
    // Engineering: sum=17000 (> 5000), count=2 (> 1) ✓
    // Marketing: sum=4000 (< 5000), count=1 (= 1) ✗
    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "Count": 2,
          "Total Salary": 11000,
          "department": "HR",
        },
        {
          "Count": 2,
          "Total Salary": 17000,
          "department": "Engineering",
        },
      ]
    `)
  })
})
