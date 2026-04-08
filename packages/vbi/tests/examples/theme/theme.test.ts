import { rs } from '@rstest/core'
import { VBI, VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('Theme', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('dark-theme', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'province',
          alias: '省份',
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
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [],
      },
      havingFilter: {
        id: 'root',
        op: 'and',
        conditions: [],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const nextTheme = 'dark'
      if (builder.theme.getTheme() !== nextTheme) {
        builder.theme.setTheme(nextTheme)
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "field": "province",
            "id": "id-2",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 10,
        "locale": "zh-CN",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "销售额",
            "encoding": "yAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "dark",
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "province",
        ],
        "limit": 10,
        "orderBy": [
          {
            "field": "id-2",
            "order": "asc",
          },
        ],
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "sales",
          },
          {
            "alias": "id-2",
            "field": "province",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": "云南",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": "吉林",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 58121,
            "id-2": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "dark",
      }
    `)
  })

  it('light-theme', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'province',
          alias: '省份',
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
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [],
      },
      havingFilter: {
        id: 'root',
        op: 'and',
        conditions: [],
      },
      theme: 'dark',
      locale: 'zh-CN',
      version: 1,
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const nextTheme = 'light'
      if (builder.theme.getTheme() !== nextTheme) {
        builder.theme.setTheme(nextTheme)
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "field": "province",
            "id": "id-2",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 10,
        "locale": "zh-CN",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "销售额",
            "encoding": "yAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "province",
        ],
        "limit": 10,
        "orderBy": [
          {
            "field": "id-2",
            "order": "asc",
          },
        ],
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "sales",
          },
          {
            "alias": "id-2",
            "field": "province",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": "云南",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": "吉林",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 58121,
            "id-2": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })
})
