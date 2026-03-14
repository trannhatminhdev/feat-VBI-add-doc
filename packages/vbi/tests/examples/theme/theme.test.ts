import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Theme', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('dark-theme', async () => {
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
          },
        ],
        "theme": "dark",
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
        "chartType": "table",
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
        "theme": "dark",
      }
    `)
  })

  it('light-theme', async () => {
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
        "chartType": "table",
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
