import { VBI, VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Locale', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('en-US-locale', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'province',
          alias: 'Province',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: 'Sales',
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
      locale: 'en-US',
      version: 1,
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const nextLocale = 'en-US'
      if (builder.locale.getLocale() !== nextLocale) {
        builder.locale.setLocale(nextLocale)
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "Province",
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
        "locale": "en-US",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "Sales",
            "encoding": "yAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "light",
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
        "chartType": "bar",
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
            "alias": "Province",
            "id": "id-2",
          },
        ],
        "locale": "en-US",
        "measures": [
          {
            "alias": "Sales",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('zh-CN-locale', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
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
      const nextLocale = 'zh-CN'
      if (builder.locale.getLocale() !== nextLocale) {
        builder.locale.setLocale(nextLocale)
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
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
        "chartType": "bar",
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
