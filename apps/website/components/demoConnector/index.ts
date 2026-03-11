import { VQuery } from '@visactor/vquery'
import { VBI } from '@visactor/vbi'
import type { DatasetColumn, RawDatasetSource, VQueryDSL } from '@visactor/vquery'
import supermarketData from '../../docs/public/dataset/supermarket.json'

export const DEMO_CONNECTOR_ID = 'demoSupermarket'

const SUPERMARKET_SCHEMA: Array<{ name: string; type: string }> = [
  { name: 'id', type: 'string' },
  { name: 'order_id', type: 'string' },
  { name: 'order_date', type: 'string' },
  { name: 'delivery_date', type: 'string' },
  { name: 'delivery_method', type: 'string' },
  { name: 'customer_id', type: 'string' },
  { name: 'customer_name', type: 'string' },
  { name: 'customer_type', type: 'string' },
  { name: 'city', type: 'string' },
  { name: 'province', type: 'string' },
  { name: 'country_or_region', type: 'string' },
  { name: 'area', type: 'string' },
  { name: 'product_id', type: 'string' },
  { name: 'product_type', type: 'string' },
  { name: 'product_sub_type', type: 'string' },
  { name: 'product_name', type: 'string' },
  { name: 'sales', type: 'number' },
  { name: 'amount', type: 'number' },
  { name: 'discount', type: 'number' },
  { name: 'profit', type: 'number' },
]

VBI.registerConnector(DEMO_CONNECTOR_ID, async () => {
  const vquery = new VQuery()

  return {
    discoverSchema: async () => {
      return SUPERMARKET_SCHEMA
    },
    query: async ({ queryDSL }) => {
      const datasetSource: RawDatasetSource = {
        type: 'json',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawDataset: supermarketData as any,
      }

      const dataset = await vquery.connectDataset(
        DEMO_CONNECTOR_ID,
        SUPERMARKET_SCHEMA as DatasetColumn[],
        datasetSource,
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryResult = await dataset.query(queryDSL as VQueryDSL<any>)
      await dataset.disconnect()

      return {
        dataset: queryResult.dataset,
      }
    },
  }
})

export const registerDemoConnector = () => {
  // No-op: connector auto-registers at module load
}
