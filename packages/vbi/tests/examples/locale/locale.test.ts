import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Locale', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('en-US-locale', async () => {
    const builder = VBI.from({
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'en-US',
      version: 1,
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.setLocale('en-US')
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
          },
        ],
        "havingFilters": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilters": [],
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
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "Sales",
            "field": "sales",
          },
          {
            "alias": "Province",
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
            "Province": "浙江",
            "Sales": 452108.2440000001,
          },
          {
            "Province": "四川",
            "Sales": 400877.5960000003,
          },
          {
            "Province": "江苏",
            "Sales": 649967.2200000006,
          },
          {
            "Province": "广东",
            "Sales": 1452929.5129999993,
          },
          {
            "Province": "江西",
            "Sales": 237328.70000000013,
          },
          {
            "Province": "陕西",
            "Sales": 457688.16800000006,
          },
          {
            "Province": "黑龙江",
            "Sales": 1178801.1620000016,
          },
          {
            "Province": "山东",
            "Sales": 1586782.9879999978,
          },
          {
            "Province": "上海",
            "Sales": 582450.5679999999,
          },
          {
            "Province": "河北",
            "Sales": 790915.405,
          },
        ],
        "locale": "en-US",
        "theme": "light",
      }
    `)
  })

  it('zh-CN-locale', async () => {
    const builder = VBI.from({
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.setLocale('zh-CN')
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
          },
        ],
        "havingFilters": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilters": [],
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
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "省份",
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
            "省份": "浙江",
            "销售额": 452108.2440000001,
          },
          {
            "省份": "四川",
            "销售额": 400877.5960000003,
          },
          {
            "省份": "江苏",
            "销售额": 649967.2200000006,
          },
          {
            "省份": "广东",
            "销售额": 1452929.5129999993,
          },
          {
            "省份": "江西",
            "销售额": 237328.70000000013,
          },
          {
            "省份": "陕西",
            "销售额": 457688.16800000006,
          },
          {
            "省份": "黑龙江",
            "销售额": 1178801.1620000016,
          },
          {
            "省份": "山东",
            "销售额": 1586782.9879999978,
          },
          {
            "省份": "上海",
            "销售额": 582450.5679999999,
          },
          {
            "省份": "河北",
            "销售额": 790915.405,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
