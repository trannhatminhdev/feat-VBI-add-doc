import type { DatasetColumn, RawDatasetSource, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import { VBI } from '@visactor/vbi'
import supermarketData from './supermarket.json'

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

/**
 * Register the demo connector that uses the full supermarket dataset
 * This connector can be reused by all test examples
 */
export function registerDemoConnector() {
  VBI.registerConnector(DEMO_CONNECTOR_ID, async () => {
    // Create a shared VQuery instance
    const vquery = new VQuery()

    // Track if dataset is initialized
    let datasetInitialized = false

    return {
      discoverSchema: async () => {
        return SUPERMARKET_SCHEMA
      },
      query: async ({ queryDSL }) => {
        // Initialize the dataset only once
        if (!datasetInitialized) {
          const datasetSource: RawDatasetSource = {
            type: 'json',
            rawDataset: supermarketData as any,
          }
          await vquery.createDataset(DEMO_CONNECTOR_ID, SUPERMARKET_SCHEMA as DatasetColumn[], datasetSource)
          datasetInitialized = true
        }

        const dataset = await vquery.connectDataset(DEMO_CONNECTOR_ID)
        const queryResult = await dataset.query(queryDSL as VQueryDSL<any>)
        await dataset.disconnect()

        return {
          dataset: queryResult.dataset,
        }
      },
    }
  })
}

/**
 * Get the demo connector ID
 */
export function getDemoConnectorId(): string {
  return DEMO_CONNECTOR_ID
}
