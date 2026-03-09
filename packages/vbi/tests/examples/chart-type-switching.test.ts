import { VBI, VBIBuilder } from '@visactor/vbi'

const mockData = [
  { year: 'year0', sales: 100, profit: 100 },
  { year: 'year1', sales: 200, profit: 200 },
  { year: 'year2', sales: 300, profit: 300 },
  { year: 'year3', sales: 400, profit: 400 },
  { year: 'year4', sales: 500, profit: 500 },
]

describe('Switch between line and bar chart types', () => {
  beforeAll(async () => {
    VBI.registerConnector('test-connector', async () => {
      return {
        discoverSchema: async () => [
          { name: 'year', type: 'string' },
          { name: 'sales', type: 'number' },
          { name: 'profit', type: 'number' },
        ],
        query: async () => ({ dataset: mockData }),
      }
    })
  })

  it('chart-type-switching', async () => {
    const builder = VBI.from({
      connectorId: 'test-connector',
      chartType: 'line',
      dimensions: [
        {
          field: 'year',
          alias: '年份',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
      ],
      filters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.chartType.changeChartType('bar')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "test-connector",
        "dimensions": [],
        "filters": [],
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
        "version": 1,
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [],
        "limit": 1000,
        "select": [],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "profit": 100,
            "sales": 100,
            "year": "year0",
          },
          {
            "profit": 200,
            "sales": 200,
            "year": "year1",
          },
          {
            "profit": 300,
            "sales": 300,
            "year": "year2",
          },
          {
            "profit": 400,
            "sales": 400,
            "year": "year3",
          },
          {
            "profit": 500,
            "sales": 500,
            "year": "year4",
          },
        ],
      }
    `)
  })
})
