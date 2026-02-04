import type { DatasetColumn, RawDatasetSource, QueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'
import fs from 'fs'
import path from 'path'

describe('VQuery load json', () => {
  const schema: DatasetColumn[] = [
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

  const queryDSL: QueryDSL<{
    city: string
    sales: number
  }> = {
    select: [
      'city',
      {
        field: 'sales',
        aggr: { func: 'sum' },
        alias: 'sales',
      },
    ],
    groupBy: ['city'],
    orderBy: [{ field: 'sales', order: 'desc' }],
    limit: 5,
  }

  it('load local json', async () => {
    const vquery = new VQuery()
    const datasetId = 'localJsonDataset'
    const filePath = path.resolve(__dirname, '../assets/supermarket.json')
    const buffer = fs.readFileSync(filePath)
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    const datasetSource: RawDatasetSource = { type: 'json', rawDataset: arrayBuffer }
    await vquery.createDataset(datasetId, schema, datasetSource)

    const dataset = await vquery.connectDataset(datasetId)
    const queryResult = await dataset.query(queryDSL)

    expect(queryResult.dataset).toMatchInlineSnapshot(`
      [
        {
          "city": "上海",
          "sales": 582450.5679999999,
        },
        {
          "city": "天津",
          "sales": 471183.5099999999,
        },
        {
          "city": "北京",
          "sales": 376814.9000000002,
        },
        {
          "city": "深圳",
          "sales": 290086.34200000006,
        },
        {
          "city": "重庆",
          "sales": 275639.78400000004,
        },
      ]
    `)

    await dataset.disconnect()
    await vquery.close()
  }, 30000)
})
