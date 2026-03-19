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
            "id-1": 452108.2440000001,
            "id-2": "浙江",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 649967.2200000006,
            "id-2": "江苏",
          },
          {
            "id-1": 1452929.5129999993,
            "id-2": "广东",
          },
          {
            "id-1": 237328.70000000013,
            "id-2": "江西",
          },
          {
            "id-1": 457688.16800000006,
            "id-2": "陕西",
          },
          {
            "id-1": 1178801.1620000016,
            "id-2": "黑龙江",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 790915.405,
            "id-2": "河北",
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
            "id-1": 452108.2440000001,
            "id-2": "浙江",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 649967.2200000006,
            "id-2": "江苏",
          },
          {
            "id-1": 1452929.5129999993,
            "id-2": "广东",
          },
          {
            "id-1": 237328.70000000013,
            "id-2": "江西",
          },
          {
            "id-1": 457688.16800000006,
            "id-2": "陕西",
          },
          {
            "id-1": 1178801.1620000016,
            "id-2": "黑龙江",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 790915.405,
            "id-2": "河北",
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
