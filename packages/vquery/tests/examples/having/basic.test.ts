import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './basic.json'

describe('Basic Having Example', () => {
  it('Basic Having Example', async () => {
    const vquery = new VQuery()
    const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    if (!(await vquery.hasDataset(datasetId))) {
      await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
    }

    const dataset = await vquery.connectDataset(datasetId)

    // Using having filter: sum(salary) > 5000
    // HR: 5000 + 6000 = 11000 (> 5000) ✓
    // Engineering: 8000 + 9000 = 17000 (> 5000) ✓
    // Marketing: 4000 (< 5000) ✗
    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    // Having filter should only return departments with sum(salary) > 5000
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
