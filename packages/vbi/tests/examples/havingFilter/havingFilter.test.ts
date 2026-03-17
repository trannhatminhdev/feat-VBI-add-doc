import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('HavingFilter', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('add-having-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.add('销售额', (node) => {
        node.setOperator('gt').setValue(1000000)
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-2",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "field": "销售额",
              "id": "id-3",
              "op": "gt",
              "value": 1000000,
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "field": "销售额",
              "op": "gt",
              "value": 1000000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "区域": "西南",
            "销售额": 1303124.508000002,
          },
          {
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('add-multiple-having-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter
        .add('销售额', (n) => n.setOperator('gt').setValue(1000000))
        .add('利润', (n) => n.setOperator('gt').setValue(200000))
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
            "alias": "区域",
            "field": "area",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "field": "销售额",
              "id": "id-4",
              "op": "gt",
              "value": 1000000,
            },
            {
              "field": "利润",
              "id": "id-5",
              "op": "gt",
              "value": 200000,
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "field": "销售额",
              "op": "gt",
              "value": 1000000,
            },
            {
              "field": "利润",
              "op": "gt",
              "value": 200000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('clear-having-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
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
        conditions: [
          {
            id: 'having-1',
            field: '销售额',
            op: 'gt',
            value: 1000000,
          },
          {
            id: 'having-2',
            field: '利润',
            op: 'gt',
            value: 200000,
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.clear()
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
            "alias": "区域",
            "field": "area",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "area",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 98553.47600000004,
            "区域": "西北",
            "销售额": 815039.5959999998,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-clear-and-rebuild', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
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
        conditions: [
          {
            id: 'old-1',
            field: '销售额',
            op: 'gt',
            value: 999999,
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.clear()
      builder.havingFilter.addGroup('and', (g) => {
        g.add('销售额', (n) => n.setOperator('gte').setValue(100000))
        g.addGroup('or', (sub) => {
          sub.add('利润', (n) => n.setOperator('gt').setValue(20000))
          sub.add('数量', (n) => n.setOperator('gte').setValue(50))
        })
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "id-6",
                  "op": "gte",
                  "value": 100000,
                },
                {
                  "conditions": [
                    {
                      "field": "利润",
                      "id": "id-8",
                      "op": "gt",
                      "value": 20000,
                    },
                    {
                      "field": "数量",
                      "id": "id-9",
                      "op": "gte",
                      "value": 50,
                    },
                  ],
                  "id": "id-7",
                  "op": "or",
                },
              ],
              "id": "id-5",
              "op": "and",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
            "id": "id-3",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gte",
                  "value": 100000,
                },
                {
                  "conditions": [
                    {
                      "field": "利润",
                      "op": "gt",
                      "value": 20000,
                    },
                    {
                      "field": "数量",
                      "op": "gte",
                      "value": 50,
                    },
                  ],
                  "op": "or",
                },
              ],
              "op": "and",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "数量": 11041,
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "数量": 3399,
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "数量": 9700,
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 98553.47600000004,
            "区域": "西北",
            "数量": 1785,
            "销售额": 815039.5959999998,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "数量": 6463,
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "数量": 5146,
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-deeply-nested-groups', async () => {
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
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'discount',
          alias: '平均折扣',
          encoding: 'yAxis',
          aggregate: {
            func: 'avg',
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
      builder.havingFilter.addGroup('or', (root) => {
        root.addGroup('and', (g1) => {
          g1.add('销售额', (n) => n.setOperator('gt').setValue(500000))
          g1.add('利润', (n) => n.setOperator('gt').setValue(50000))
        })
        root.addGroup('and', (g2) => {
          g2.add('数量', (n) => n.setOperator('gt').setValue(100))
          g2.add('平均折扣', (n) => n.setOperator('lt').setValue(0.3))
        })
      })
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
            "id": "id-5",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "conditions": [
                    {
                      "field": "销售额",
                      "id": "id-8",
                      "op": "gt",
                      "value": 500000,
                    },
                    {
                      "field": "利润",
                      "id": "id-9",
                      "op": "gt",
                      "value": 50000,
                    },
                  ],
                  "id": "id-7",
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "field": "数量",
                      "id": "id-11",
                      "op": "gt",
                      "value": 100,
                    },
                    {
                      "field": "平均折扣",
                      "id": "id-12",
                      "op": "lt",
                      "value": 0.3,
                    },
                  ],
                  "id": "id-10",
                  "op": "and",
                },
              ],
              "id": "id-6",
              "op": "or",
            },
          ],
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
            "id": "id-3",
          },
          {
            "aggregate": {
              "func": "avg",
            },
            "alias": "平均折扣",
            "encoding": "yAxis",
            "field": "discount",
            "id": "id-4",
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
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "conditions": [
                    {
                      "field": "销售额",
                      "op": "gt",
                      "value": 500000,
                    },
                    {
                      "field": "利润",
                      "op": "gt",
                      "value": 50000,
                    },
                  ],
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "field": "数量",
                      "op": "gt",
                      "value": 100,
                    },
                    {
                      "field": "平均折扣",
                      "op": "lt",
                      "value": 0.3,
                    },
                  ],
                  "op": "and",
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
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
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "aggr": {
              "func": "avg",
            },
            "alias": "平均折扣",
            "field": "discount",
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
            "利润": 337994.9929999998,
            "平均折扣": 0.023800959232613886,
            "数量": 3092,
            "省份": "广东",
            "销售额": 1452929.5129999993,
          },
          {
            "利润": 47807.06000000001,
            "平均折扣": 0.0057553956834532375,
            "数量": 506,
            "省份": "江西",
            "销售额": 237328.70000000013,
          },
          {
            "利润": 105814.68799999998,
            "平均折扣": 0.006779661016949153,
            "数量": 909,
            "省份": "陕西",
            "销售额": 457688.16800000006,
          },
          {
            "利润": 257172.06199999977,
            "平均折扣": 0.014701257861635222,
            "数量": 2518,
            "省份": "黑龙江",
            "销售额": 1178801.1620000016,
          },
          {
            "利润": 385463.008,
            "平均折扣": 0.0030634573304157546,
            "数量": 3399,
            "省份": "山东",
            "销售额": 1586782.9879999978,
          },
          {
            "利润": 121650.088,
            "平均折扣": 0.00684931506849315,
            "数量": 1080,
            "省份": "上海",
            "销售额": 582450.5679999999,
          },
          {
            "利润": 172031.6850000001,
            "平均折扣": 0.007731958762886598,
            "数量": 1511,
            "省份": "河北",
            "销售额": 790915.405,
          },
          {
            "利润": 142601.73200000002,
            "平均折扣": 0.004633204633204634,
            "数量": 962,
            "省份": "福建",
            "销售额": 546903.5320000001,
          },
          {
            "利润": 149028.81000000008,
            "平均折扣": 0.015850144092219024,
            "数量": 1302,
            "省份": "安徽",
            "销售额": 628965.1899999997,
          },
          {
            "利润": 153058.17100000003,
            "平均折扣": 0.015697674418604656,
            "数量": 1298,
            "省份": "吉林",
            "销售额": 640196.5709999998,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-find-and-update', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [
        {
          field: 'product_type',
          alias: '品类',
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
        {
          field: 'profit',
          alias: '利润',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter
        .add('销售额', (n) => n.setOperator('gt').setValue(100000))
        .add('利润', (n) => n.setOperator('gt').setValue(10000))
      const json = builder.havingFilter.toJSON().conditions
      const salesId = json[0].id
      const profitId = json[1].id
      builder.havingFilter.update(salesId, (n) => {
        n.setOperator('gte').setValue(500000)
      })
      builder.havingFilter.update(profitId, (n) => {
        n.setOperator('gte').setValue(50000)
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "品类",
            "field": "product_type",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "field": "销售额",
              "id": "id-4",
              "op": "gte",
              "value": 500000,
            },
            {
              "field": "利润",
              "id": "id-5",
              "op": "gte",
              "value": 50000,
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "product_type",
        ],
        "having": {
          "conditions": [
            {
              "field": "销售额",
              "op": "gte",
              "value": 500000,
            },
            {
              "field": "利润",
              "op": "gte",
              "value": 50000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "品类",
            "field": "product_type",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "利润": 757640.3519999951,
            "品类": "办公用品",
            "销售额": 4865589.791999991,
          },
          {
            "利润": 751162.9440000018,
            "品类": "技术",
            "销售额": 5469023.503999994,
          },
          {
            "利润": 638735.6290000005,
            "品类": "家具",
            "销售额": 5734340.829,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-group-add-to-existing', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
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
        conditions: [
          {
            id: 'group-1',
            op: 'or',
            conditions: [
              {
                id: 'cond-1',
                field: '销售额',
                op: 'gt',
                value: 500000,
              },
            ],
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.add('利润', (n) => n.setOperator('gt').setValue(100000))
        group.add('数量', (n) => n.setOperator('gte').setValue(200))
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "cond-1",
                  "op": "gt",
                  "value": 500000,
                },
                {
                  "field": "利润",
                  "id": "id-5",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "field": "数量",
                  "id": "id-6",
                  "op": "gte",
                  "value": 200,
                },
              ],
              "id": "group-1",
              "op": "or",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
            "id": "id-3",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 500000,
                },
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "field": "数量",
                  "op": "gte",
                  "value": 200,
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "数量": 11041,
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "数量": 3399,
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "数量": 9700,
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 98553.47600000004,
            "区域": "西北",
            "数量": 1785,
            "销售额": 815039.5959999998,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "数量": 6463,
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "数量": 5146,
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-group-remove-condition', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [
        {
          field: 'product_type',
          alias: '品类',
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
        {
          field: 'profit',
          alias: '利润',
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
        conditions: [
          {
            id: 'group-1',
            op: 'and',
            conditions: [
              {
                id: 'cond-1',
                field: '销售额',
                op: 'gt',
                value: 100000,
              },
              {
                id: 'cond-2',
                field: '利润',
                op: 'gt',
                value: 10000,
              },
            ],
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.remove('cond-1')
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "品类",
            "field": "product_type",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "利润",
                  "id": "cond-2",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "id": "group-1",
              "op": "and",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "product_type",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "op": "and",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "品类",
            "field": "product_type",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "利润": 757640.3519999951,
            "品类": "办公用品",
            "销售额": 4865589.791999991,
          },
          {
            "利润": 751162.9440000018,
            "品类": "技术",
            "销售额": 5469023.503999994,
          },
          {
            "利润": 638735.6290000005,
            "品类": "家具",
            "销售额": 5734340.829,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-mix-filters-and-groups', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter
        .add('销售额', (n) => n.setOperator('gt').setValue(500000))
        .addGroup('or', (group) => {
          group.add('利润', (n) => n.setOperator('gt').setValue(100000))
          group.add('数量', (n) => n.setOperator('gte').setValue(30))
        })
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
            "alias": "区域",
            "field": "area",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "field": "销售额",
              "id": "id-5",
              "op": "gt",
              "value": 500000,
            },
            {
              "conditions": [
                {
                  "field": "利润",
                  "id": "id-7",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "field": "数量",
                  "id": "id-8",
                  "op": "gte",
                  "value": 30,
                },
              ],
              "id": "id-6",
              "op": "or",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
            "id": "id-3",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "field": "销售额",
              "op": "gt",
              "value": 500000,
            },
            {
              "conditions": [
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "field": "数量",
                  "op": "gte",
                  "value": 30,
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "数量": 11041,
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "数量": 3399,
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "数量": 9700,
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 98553.47600000004,
            "区域": "西北",
            "数量": 1785,
            "销售额": 815039.5959999998,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "数量": 6463,
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "数量": 5146,
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-multi-dimension-aggregate', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'product_type',
          alias: '品类',
        },
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'discount',
          alias: '平均折扣',
          encoding: 'yAxis',
          aggregate: {
            func: 'avg',
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
      builder.havingFilter.addGroup('and', (g) => {
        g.add('平均折扣', (n) => n.setOperator('lt').setValue(0.2))
        g.add('销售额', (n) => n.setOperator('gt').setValue(100000))
      })
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
            "alias": "品类",
            "field": "product_type",
            "id": "id-3",
          },
          {
            "alias": "区域",
            "field": "area",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "平均折扣",
                  "id": "id-6",
                  "op": "lt",
                  "value": 0.2,
                },
                {
                  "field": "销售额",
                  "id": "id-7",
                  "op": "gt",
                  "value": 100000,
                },
              ],
              "id": "id-5",
              "op": "and",
            },
          ],
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
          {
            "aggregate": {
              "func": "avg",
            },
            "alias": "平均折扣",
            "encoding": "yAxis",
            "field": "discount",
            "id": "id-2",
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
          "product_type",
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "平均折扣",
                  "op": "lt",
                  "value": 0.2,
                },
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 100000,
                },
              ],
              "op": "and",
            },
          ],
          "op": "and",
        },
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
            "aggr": {
              "func": "avg",
            },
            "alias": "平均折扣",
            "field": "discount",
          },
          {
            "alias": "品类",
            "field": "product_type",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "区域": "华东",
            "品类": "办公用品",
            "平均折扣": 0.09382716049382762,
            "销售额": 1408628.5919999965,
          },
          {
            "区域": "西南",
            "品类": "办公用品",
            "平均折扣": 0.1015624999999998,
            "销售额": 347692.57600000035,
          },
          {
            "区域": "中南",
            "品类": "办公用品",
            "平均折扣": 0.07298387096774223,
            "销售额": 1270911.2639999979,
          },
          {
            "区域": "华东",
            "品类": "技术",
            "平均折扣": 0.1283276450511945,
            "销售额": 1599653.7199999986,
          },
          {
            "区域": "华东",
            "品类": "家具",
            "平均折扣": 0.14657534246575374,
            "销售额": 1676224.1299999976,
          },
          {
            "区域": "西北",
            "品类": "技术",
            "平均折扣": 0.13061224489795925,
            "销售额": 230956.376,
          },
          {
            "区域": "东北",
            "品类": "技术",
            "平均折扣": 0.15846994535519088,
            "销售额": 936196.0160000008,
          },
          {
            "区域": "华北",
            "品类": "办公用品",
            "平均折扣": 0.043835616438356116,
            "销售额": 745813.5159999988,
          },
          {
            "区域": "华北",
            "品类": "家具",
            "平均折扣": 0.08083067092651754,
            "销售额": 919743.9369999996,
          },
          {
            "区域": "西北",
            "品类": "办公用品",
            "平均折扣": 0.08030303030303029,
            "销售额": 267870.7920000001,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-nested-groups', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.addGroup('and', (outer) => {
        outer.add('销售额', (n) => n.setOperator('gt').setValue(1000000))
        outer.addGroup('or', (inner) => {
          inner.add('利润', (n) => n.setOperator('gt').setValue(200000))
          inner.add('数量', (n) => n.setOperator('gte').setValue(50))
        })
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "id-6",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "conditions": [
                    {
                      "field": "利润",
                      "id": "id-8",
                      "op": "gt",
                      "value": 200000,
                    },
                    {
                      "field": "数量",
                      "id": "id-9",
                      "op": "gte",
                      "value": 50,
                    },
                  ],
                  "id": "id-7",
                  "op": "or",
                },
              ],
              "id": "id-5",
              "op": "and",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
            "id": "id-3",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "conditions": [
                    {
                      "field": "利润",
                      "op": "gt",
                      "value": 200000,
                    },
                    {
                      "field": "数量",
                      "op": "gte",
                      "value": 50,
                    },
                  ],
                  "op": "or",
                },
              ],
              "op": "and",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "数量": 11041,
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "数量": 3399,
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "数量": 9700,
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "数量": 6463,
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "数量": 5146,
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-or-group', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.addGroup('or', (group) => {
        group.add('销售额', (n) => n.setOperator('gt').setValue(1000000))
        group.add('利润', (n) => n.setOperator('gt').setValue(200000))
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "id-5",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "field": "利润",
                  "id": "id-6",
                  "op": "gt",
                  "value": 200000,
                },
              ],
              "id": "id-4",
              "op": "or",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 200000,
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-scatter-profit-analysis', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'scatter',
      dimensions: [
        {
          field: 'product_sub_type',
          alias: '子品类',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'xAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
        {
          field: 'amount',
          alias: '数量',
          encoding: 'size',
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
      builder.havingFilter.addGroup('and', (g) => {
        g.add('利润', (n) => n.setOperator('gt').setValue(0))
        g.add('数量', (n) => n.setOperator('gt').setValue(20))
        g.add('销售额', (n) => n.setOperator('gt').setValue(10000))
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "scatter",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "子品类",
            "field": "product_sub_type",
            "id": "id-4",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "利润",
                  "id": "id-6",
                  "op": "gt",
                  "value": 0,
                },
                {
                  "field": "数量",
                  "id": "id-7",
                  "op": "gt",
                  "value": 20,
                },
                {
                  "field": "销售额",
                  "id": "id-8",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "id": "id-5",
              "op": "and",
            },
          ],
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
            "encoding": "xAxis",
            "field": "sales",
            "id": "id-1",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "size",
            "field": "amount",
            "id": "id-3",
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
          "product_sub_type",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 0,
                },
                {
                  "field": "数量",
                  "op": "gt",
                  "value": 20,
                },
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "op": "and",
            },
          ],
          "op": "and",
        },
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
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "数量",
            "field": "amount",
          },
          {
            "alias": "子品类",
            "field": "product_sub_type",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "scatter",
        "dataset": [
          {
            "利润": 40576.339999999946,
            "子品类": "用品",
            "数量": 2266,
            "销售额": 287970.48000000004,
          },
          {
            "利润": 72505.0200000001,
            "子品类": "信封",
            "数量": 2281,
            "销售额": 287486.0799999999,
          },
          {
            "利润": 42758.49200000001,
            "子品类": "装订机",
            "数量": 3352,
            "销售额": 291776.91199999995,
          },
          {
            "利润": 199027.02400000003,
            "子品类": "器具",
            "数量": 2134,
            "销售额": 2160183.0039999983,
          },
          {
            "利润": 144110.62400000004,
            "子品类": "设备",
            "数量": 1241,
            "销售额": 874465.1440000004,
          },
          {
            "利润": 325836.7279999995,
            "子品类": "椅子",
            "数量": 3172,
            "销售额": 2085435.967999999,
          },
          {
            "利润": 61622.26000000004,
            "子品类": "纸张",
            "数量": 2063,
            "销售额": 263334.1200000003,
          },
          {
            "利润": 18628.988000000023,
            "子品类": "系固件",
            "数量": 2272,
            "销售额": 129010.72800000005,
          },
          {
            "利润": 252897.2600000002,
            "子品类": "复印机",
            "数量": 2139,
            "销售额": 1991498.8800000001,
          },
          {
            "利润": 130805.4160000001,
            "子品类": "配件",
            "数量": 2085,
            "销售额": 803406.0159999998,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-update-group-operator', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
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
        conditions: [
          {
            id: 'group-1',
            op: 'and',
            conditions: [
              {
                id: 'cond-1',
                field: '销售额',
                op: 'gt',
                value: 1000000,
              },
              {
                id: 'cond-2',
                field: '利润',
                op: 'gt',
                value: 200000,
              },
            ],
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.setOperator('or')
      })
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
            "alias": "区域",
            "field": "area",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "cond-1",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "field": "利润",
                  "id": "cond-2",
                  "op": "gt",
                  "value": 200000,
                },
              ],
              "id": "group-1",
              "op": "or",
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 200000,
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "利润": 97636.72800000008,
            "区域": "西南",
            "销售额": 1303124.508000002,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('having-with-where-combined', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
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
        {
          field: 'profit',
          alias: '利润',
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
      builder.whereFilter.add('product_type', (n) => n.setOperator('=').setValue('办公用品'))
      builder.havingFilter.addGroup('or', (g) => {
        g.add('销售额', (n) => n.setOperator('gt').setValue(50000))
        g.add('利润', (n) => n.setOperator('gt').setValue(10000))
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "field": "province",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "id": "id-6",
                  "op": "gt",
                  "value": 50000,
                },
                {
                  "field": "利润",
                  "id": "id-7",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "id": "id-5",
              "op": "or",
            },
          ],
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "product_type",
              "id": "id-4",
              "op": "=",
              "value": "办公用品",
            },
          ],
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
        "having": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "销售额",
                  "op": "gt",
                  "value": 50000,
                },
                {
                  "field": "利润",
                  "op": "gt",
                  "value": 10000,
                },
              ],
              "op": "or",
            },
          ],
          "op": "and",
        },
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
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "省份",
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "product_type",
              "op": "=",
              "value": "办公用品",
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "利润": -24613.064000000013,
            "省份": "浙江",
            "销售额": 145678.31599999996,
          },
          {
            "利润": -6415.164000000001,
            "省份": "四川",
            "销售额": 114141.496,
          },
          {
            "利润": 1968.175999999995,
            "省份": "江苏",
            "销售额": 237378.876,
          },
          {
            "利润": 97420.26000000018,
            "省份": "广东",
            "销售额": 408478.70000000024,
          },
          {
            "利润": 128908.9200000001,
            "省份": "山东",
            "销售额": 490581.2800000006,
          },
          {
            "利润": 35229.46,
            "省份": "上海",
            "销售额": 197696.65999999997,
          },
          {
            "利润": 61986.680000000015,
            "省份": "河北",
            "销售额": 225399.8599999999,
          },
          {
            "利润": 21840.419999999995,
            "省份": "福建",
            "销售额": 100060.37999999998,
          },
          {
            "利润": 43450.12000000001,
            "省份": "安徽",
            "销售额": 192031.5600000002,
          },
          {
            "利润": 85618.93200000006,
            "省份": "黑龙江",
            "销售额": 397944.37199999974,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('remove-having-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
        {
          field: 'profit',
          alias: '利润',
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
        conditions: [
          {
            id: 'having-1',
            field: '销售额',
            op: 'gt',
            value: 1000000,
          },
          {
            id: 'having-2',
            field: '利润',
            op: 'gt',
            value: 200000,
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilter.remove('having-1')
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
            "alias": "区域",
            "field": "area",
            "id": "id-3",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "field": "利润",
              "id": "having-2",
              "op": "gt",
              "value": 200000,
            },
          ],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
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
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-2",
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
          "area",
        ],
        "having": {
          "conditions": [
            {
              "field": "利润",
              "op": "gt",
              "value": 200000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
            "field": "area",
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
            "利润": 607218.6819999996,
            "区域": "华东",
            "销售额": 4684506.442,
          },
          {
            "利润": 670885.313,
            "区域": "中南",
            "销售额": 4137415.0929999948,
          },
          {
            "利润": 242191.50899999973,
            "区域": "东北",
            "销售额": 2681567.469000001,
          },
          {
            "利润": 431053.2169999998,
            "区域": "华北",
            "销售额": 2447301.017000004,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
