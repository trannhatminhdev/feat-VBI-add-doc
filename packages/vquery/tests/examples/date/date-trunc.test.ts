/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatasetColumn, RawDatasetSource, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'

describe('Generated VQuery Tests', () => {
  it('runs generated tests from dsl.json', async () => {
    const vquery = new VQuery()
    const datasetId = 'dateDataset'

    const rawDataset = [
      {
        date: '2025-01-01 10:30:45',
        sales: 100,
      },
      {
        date: '2025-01-01 11:15:00',
        sales: 200,
      },
      {
        date: '2025-01-02 09:00:00',
        sales: 300,
      },
      {
        date: '2025-02-01 10:00:00',
        sales: 400,
      },
    ]

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    const schema: DatasetColumn[] = [
      {
        name: 'date',
        type: 'timestamp',
      },
      {
        name: 'sales',
        type: 'number',
      },
    ]
    const datasetSource: RawDatasetSource = { type: 'json', rawDataset }
    await vquery.createDataset(datasetId, schema, datasetSource)

    const dataset = await vquery.connectDataset(datasetId)

    // Year
    const query0: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_year',
          alias: 'year',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['year'],
      orderBy: [
        {
          field: 'year',
          order: 'asc',
        },
      ],
    }
    const result0 = await dataset.query(query0)
    expect(result0.dataset).toHaveLength(1)
    expect(result0.dataset[0]['sales'] as unknown).toBe(1000)
    expect(new Date(result0.dataset[0]['year'] as unknown as string).getFullYear()).toBe(2025)

    // Month
    const query1: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_month',
          alias: 'month',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['month'],
      orderBy: [
        {
          field: 'month',
          order: 'asc',
        },
      ],
    }
    const result1 = await dataset.query(query1)
    expect(result1.dataset).toHaveLength(2)
    expect(result1.dataset[0]['sales'] as unknown).toBe(600)
    expect(new Date(result1.dataset[0]['month'] as unknown as string).getMonth()).toBe(0)

    // Day
    const query2: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_day',
          alias: 'day',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['day'],
      orderBy: [
        {
          field: 'day',
          order: 'asc',
        },
      ],
    }
    const result2 = await dataset.query(query2)
    expect(result2.dataset).toHaveLength(3)
    expect(result2.dataset[0]['sales'] as unknown).toBe(300)

    // Hour
    const query3: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_hour',
          alias: 'hour',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['hour'],
      orderBy: [
        {
          field: 'hour',
          order: 'asc',
        },
      ],
    }
    const result3 = await dataset.query(query3)
    expect(result3.dataset).toHaveLength(4)

    // Minute
    const query4: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_minute',
          alias: 'minute',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['minute'],
      orderBy: [
        {
          field: 'minute',
          order: 'asc',
        },
      ],
    }
    const result4 = await dataset.query(query4)
    expect(result4.dataset).toHaveLength(4)

    // Second
    const query5: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_second',
          alias: 'second',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['second'],
      orderBy: [
        {
          field: 'second',
          order: 'asc',
        },
      ],
    }
    const result5 = await dataset.query(query5)
    expect(result5.dataset).toHaveLength(4)

    // Quarter
    const query6: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_quarter',
          alias: 'quarter',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['quarter'],
      orderBy: [
        {
          field: 'quarter',
          order: 'asc',
        },
      ],
    }
    const result6 = await dataset.query(query6)
    expect(result6.dataset).toHaveLength(1)
    expect(result6.dataset[0]['sales'] as unknown).toBe(1000)

    // Week
    const query7: VQueryDSL<{ [key: string]: any }> = {
      select: [
        {
          field: 'date',
          func: 'to_week',
          alias: 'week',
        },
        {
          field: 'sales',
          func: 'sum',
          alias: 'sales',
        },
      ],
      groupBy: ['week'],
      orderBy: [
        {
          field: 'week',
          order: 'asc',
        },
      ],
    }
    const result7 = await dataset.query(query7)
    expect(result7.dataset).toHaveLength(2)

    await dataset.disconnect()
    await vquery.close()
  })
})
