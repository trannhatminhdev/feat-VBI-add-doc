import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('HavingFilters', () => {
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.add('销售额', (node) => {
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
          },
        ],
        "havingFilters": [
          {
            "field": "销售额",
            "id": "id-1",
            "operator": "gt",
            "value": 1000000,
          },
        ],
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

  it('add-multiple-having-filters', async () => {
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters
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
          },
        ],
        "havingFilters": [
          {
            "field": "销售额",
            "id": "id-1",
            "operator": "gt",
            "value": 1000000,
          },
          {
            "field": "利润",
            "id": "id-2",
            "operator": "gt",
            "value": 200000,
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
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

  it('clear-having-filters', async () => {
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
      whereFilters: [],
      havingFilters: [
        {
          id: 'having-1',
          field: '销售额',
          operator: 'gt',
          value: 1000000,
        },
        {
          id: 'having-2',
          field: '利润',
          operator: 'gt',
          value: 200000,
        },
      ],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.clear()
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
          },
        ],
        "havingFilters": [],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters
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
          },
        ],
        "havingFilters": [
          {
            "field": "销售额",
            "id": "id-1",
            "operator": "gt",
            "value": 500000,
          },
          {
            "conditions": [
              {
                "field": "利润",
                "id": "id-3",
                "operator": "gt",
                "value": 100000,
              },
              {
                "field": "数量",
                "id": "id-4",
                "operator": "gte",
                "value": 30,
              },
            ],
            "id": "id-2",
            "op": "or",
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.addGroup('and', (outer) => {
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
          },
        ],
        "havingFilters": [
          {
            "conditions": [
              {
                "field": "销售额",
                "id": "id-2",
                "operator": "gt",
                "value": 1000000,
              },
              {
                "conditions": [
                  {
                    "field": "利润",
                    "id": "id-4",
                    "operator": "gt",
                    "value": 200000,
                  },
                  {
                    "field": "数量",
                    "id": "id-5",
                    "operator": "gte",
                    "value": 50,
                  },
                ],
                "id": "id-3",
                "op": "or",
              },
            ],
            "id": "id-1",
            "op": "and",
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "数量",
            "encoding": "yAxis",
            "field": "amount",
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.addGroup('or', (group) => {
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
          },
        ],
        "havingFilters": [
          {
            "conditions": [
              {
                "field": "销售额",
                "id": "id-2",
                "operator": "gt",
                "value": 1000000,
              },
              {
                "field": "利润",
                "id": "id-3",
                "operator": "gt",
                "value": 200000,
              },
            ],
            "id": "id-1",
            "op": "or",
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
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
      whereFilters: [],
      havingFilters: [
        {
          id: 'group-1',
          op: 'and',
          conditions: [
            {
              id: 'cond-1',
              field: '销售额',
              operator: 'gt',
              value: 1000000,
            },
            {
              id: 'cond-2',
              field: '利润',
              operator: 'gt',
              value: 200000,
            },
          ],
        },
      ],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.updateGroup('group-1', (group) => {
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
          },
        ],
        "havingFilters": [
          {
            "conditions": [
              {
                "field": "销售额",
                "id": "cond-1",
                "operator": "gt",
                "value": 1000000,
              },
              {
                "field": "利润",
                "id": "cond-2",
                "operator": "gt",
                "value": 200000,
              },
            ],
            "id": "group-1",
            "op": "or",
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
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
      whereFilters: [],
      havingFilters: [
        {
          id: 'having-1',
          field: '销售额',
          operator: 'gt',
          value: 1000000,
        },
        {
          id: 'having-2',
          field: '利润',
          operator: 'gt',
          value: 200000,
        },
      ],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.havingFilters.remove('having-1')
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
          },
        ],
        "havingFilters": [
          {
            "field": "利润",
            "id": "having-2",
            "operator": "gt",
            "value": 200000,
          },
        ],
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
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
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
