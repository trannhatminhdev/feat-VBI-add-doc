import type { DatasetColumn, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import vqueryConfig from './or-conditions.json'

describe('Having with OR Conditions', () => {
  it('Having with OR conditions', async () => {
    const vquery = new VQuery()
    const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    if (!(await vquery.hasDataset(datasetId))) {
      await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
    }

    const dataset = await vquery.connectDataset(datasetId)

    // Using having filter: sum(salary) > 15000 OR sum(salary) < 5000
    // HR: sum=11000 (not > 15000 and not < 5000) ✗
    // Engineering: sum=17000 (> 15000) ✓
    // Marketing: sum=4000 (< 5000) ✓
    const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)

    await dataset.disconnect()
    await vquery.close()

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "Total Salary": 17000,
          "department": "Engineering",
        },
        {
          "Total Salary": 4000,
          "department": "Marketing",
        },
      ]
    `)
  })
})
