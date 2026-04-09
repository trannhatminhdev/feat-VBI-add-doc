import { rs } from '@rstest/core'
import { VBI, type VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('chart / HavingFilter', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('add-having-filter', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.add('sales', (node) => {
        node.setAggregate({ func: 'sum' }).setOperator('gt').setValue(1000000)
      })
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "gt",
              "value": 1000000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
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
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": "华北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
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

  it('add-multiple-having-filter', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter
        .add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(1000000))
        .add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(200000))
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
              "id": "id-4",
              "op": "gt",
              "value": 1000000,
            },
            {
              "aggregate": {
                "func": "sum",
              },
              "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "gt",
              "value": 1000000,
            },
            {
              "aggr": {
                "func": "sum",
              },
              "field": "profit",
              "op": "gt",
              "value": 200000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": "华北",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('clear-having-filter', async () => {
    const builder = VBI.createChart({
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
            field: 'sales',
            op: 'gt',
            value: 1000000,
            aggregate: {
              func: 'sum',
            },
          },
          {
            id: 'having-2',
            field: 'profit',
            op: 'gt',
            value: 200000,
            aggregate: {
              func: 'sum',
            },
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.clear()
    }
    applyBuilder(builder)

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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "limit": 20,
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": "华北",
          },
          {
            "id-1": 815039.5959999998,
            "id-2": 98553.47600000004,
            "id-3": "西北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-array-value-with-in-operator', async () => {
    const builder = VBI.createChart({
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
      limit: 10,
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.add('sales', (node) => {
        node.setOperator('=').setValue([100, 200, 300])
      })
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
              "id": "id-3",
              "op": "=",
              "value": [
                100,
                200,
                300,
              ],
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

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "in",
              "value": [
                100,
                200,
                300,
              ],
            },
          ],
          "op": "and",
        },
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
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [],
        "dimensions": [
          {
            "alias": "区域",
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

  it('having-array-value-with-not-in-operator', async () => {
    const builder = VBI.createChart({
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
      limit: 10,
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.add('sales', (node) => {
        node.setOperator('!=').setValue([100, 200])
      })
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
              "id": "id-3",
              "op": "!=",
              "value": [
                100,
                200,
              ],
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

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "not in",
              "value": [
                100,
                200,
              ],
            },
          ],
          "op": "and",
        },
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
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": "华北",
          },
          {
            "id-1": 815039.5959999998,
            "id-2": "西北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
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

  it('having-clear-and-rebuild', async () => {
    const builder = VBI.createChart({
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
            field: 'sales',
            op: 'gt',
            value: 999999,
            aggregate: {
              func: 'sum',
            },
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.clear()
      builder.havingFilter.addGroup('and', (g) => {
        g.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gte').setValue(100000))
        g.addGroup('or', (sub) => {
          sub.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(20000))
          sub.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gte').setValue(50))
        })
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "id-6",
                  "op": "gte",
                  "value": 100000,
                },
                {
                  "conditions": [
                    {
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "profit",
                      "id": "id-8",
                      "op": "gt",
                      "value": 20000,
                    },
                    {
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "amount",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gte",
                  "value": 100000,
                },
                {
                  "conditions": [
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "profit",
                      "op": "gt",
                      "value": 20000,
                    },
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "amount",
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
        "orderBy": [
          {
            "field": "id-4",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "alias": "id-4",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": 6463,
            "id-4": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": 9700,
            "id-4": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": 11041,
            "id-4": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": 5146,
            "id-4": "华北",
          },
          {
            "id-1": 815039.5959999998,
            "id-2": 98553.47600000004,
            "id-3": 1785,
            "id-4": "西北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": 3399,
            "id-4": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "yAxis",
            "id": "id-3",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-deeply-nested-groups', async () => {
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.addGroup('or', (root) => {
        root.addGroup('and', (g1) => {
          g1.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(500000))
          g1.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(50000))
        })
        root.addGroup('and', (g2) => {
          g2.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100))
          g2.add('discount', (n) => n.setAggregate({ func: 'avg' }).setOperator('lt').setValue(0.3))
        })
      })
    }
    applyBuilder(builder)

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
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "sales",
                      "id": "id-8",
                      "op": "gt",
                      "value": 500000,
                    },
                    {
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "profit",
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
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "amount",
                      "id": "id-11",
                      "op": "gt",
                      "value": 100,
                    },
                    {
                      "aggregate": {
                        "func": "avg",
                      },
                      "field": "discount",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "sales",
                      "op": "gt",
                      "value": 500000,
                    },
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "profit",
                      "op": "gt",
                      "value": 50000,
                    },
                  ],
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "amount",
                      "op": "gt",
                      "value": 100,
                    },
                    {
                      "aggr": {
                        "func": "avg",
                      },
                      "field": "discount",
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
        "orderBy": [
          {
            "field": "id-5",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "aggr": {
              "func": "avg",
            },
            "alias": "id-4",
            "field": "discount",
          },
          {
            "alias": "id-5",
            "field": "province",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": 121650.088,
            "id-3": 1080,
            "id-4": 0.00684931506849315,
            "id-5": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": 86639.16800000003,
            "id-3": 665,
            "id-4": 0.015662650602409643,
            "id-5": "云南",
          },
          {
            "id-1": 409147.2,
            "id-2": 91961.94000000003,
            "id-3": 956,
            "id-4": 0,
            "id-5": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": 153058.17100000003,
            "id-3": 1298,
            "id-4": 0.015697674418604656,
            "id-5": "吉林",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": 117704.08999999998,
            "id-3": 1096,
            "id-4": 0.004934210526315789,
            "id-5": "天津",
          },
          {
            "id-1": 58121,
            "id-2": 8537.62,
            "id-3": 126,
            "id-4": 0.021052631578947368,
            "id-5": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": 149028.81000000008,
            "id-3": 1302,
            "id-4": 0.015850144092219024,
            "id-5": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": 385463.008,
            "id-3": 3399,
            "id-4": 0.0030634573304157546,
            "id-5": "山东",
          },
          {
            "id-1": 423878.76999999967,
            "id-2": 107063.39000000009,
            "id-3": 750,
            "id-4": 0.004975124378109453,
            "id-5": "山西",
          },
          {
            "id-1": 1452929.5129999993,
            "id-2": 337994.9929999998,
            "id-3": 3092,
            "id-4": 0.023800959232613886,
            "id-5": "广东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "id": "id-5",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "yAxis",
            "id": "id-3",
          },
          {
            "alias": "平均折扣",
            "encoding": "yAxis",
            "id": "id-4",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-empty-dsl-compose-target', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'line',
      dimensions: [],
      measures: [],
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
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.chartType.changeChartType('table')
      builder.theme.setTheme('light')
      builder.locale.setLocale('zh-CN')
      builder.whereFilter.add('profit', (n) => n.setOperator('<').setValue(0))
      const whereConds = builder.whereFilter.getConditions()
      whereConds.get(0).set('id', 'c84825ed-547a-48f0-b4d9-55ebe53aab8c')
      builder.havingFilter.clear()
      builder.havingFilter.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('lt').setValue(-100000))
      builder.havingFilter.add('province', (n) =>
        n.setAggregate({ func: 'countDistinct' }).setOperator('gt').setValue(4),
      )
      const havingConds = builder.havingFilter.getConditions()
      havingConds.get(0).set('id', 'a6f2f16a-e0fc-4bdc-9729-bbe3a105cfca')
      havingConds.get(1).set('id', '01c004d2-4041-40ee-a18b-a18fc0cea416')
      builder.measures.add('sales', (n) => n.setAlias('sales').setEncoding('yAxis').setAggregate({ func: 'sum' }))
      builder.measures.add('country_or_region', (n) =>
        n.setAlias('country_or_region').setEncoding('yAxis').setAggregate({ func: 'count' }),
      )
      const measures = builder.dsl.get('measures')
      measures.get(0).set('id', 'a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850')
      measures.get(1).set('id', '49f3b33d-4ede-436c-8be9-a51619236916')
      builder.dimensions.add('area', (n) => n.setAlias('area'))
      const dimensions = builder.dsl.get('dimensions')
      dimensions.get(0).set('id', 'c3583433-a2cc-4234-85ff-75ae2472b674')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "area",
            "encoding": "column",
            "field": "area",
            "id": "c3583433-a2cc-4234-85ff-75ae2472b674",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "aggregate": {
                "func": "sum",
              },
              "field": "profit",
              "id": "a6f2f16a-e0fc-4bdc-9729-bbe3a105cfca",
              "op": "lt",
              "value": -100000,
            },
            {
              "aggregate": {
                "func": "countDistinct",
              },
              "field": "province",
              "id": "01c004d2-4041-40ee-a18b-a18fc0cea416",
              "op": "gt",
              "value": 4,
            },
          ],
          "id": "root",
          "op": "and",
        },
        "locale": "zh-CN",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "sales",
            "encoding": "yAxis",
            "field": "sales",
            "id": "a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850",
          },
          {
            "aggregate": {
              "func": "count",
            },
            "alias": "country_or_region",
            "encoding": "yAxis",
            "field": "country_or_region",
            "id": "49f3b33d-4ede-436c-8be9-a51619236916",
          },
        ],
        "theme": "light",
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "profit",
              "id": "c84825ed-547a-48f0-b4d9-55ebe53aab8c",
              "op": "<",
              "value": 0,
            },
          ],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "profit",
              "op": "lt",
              "value": -100000,
            },
            {
              "aggr": {
                "func": "count_distinct",
              },
              "field": "province",
              "op": "gt",
              "value": 4,
            },
          ],
          "op": "and",
        },
        "limit": 1000,
        "orderBy": [
          {
            "field": "c3583433-a2cc-4234-85ff-75ae2472b674",
            "order": "asc",
          },
        ],
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "count",
            },
            "alias": "49f3b33d-4ede-436c-8be9-a51619236916",
            "field": "country_or_region",
          },
          {
            "alias": "c3583433-a2cc-4234-85ff-75ae2472b674",
            "field": "area",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "profit",
              "op": "<",
              "value": 0,
            },
          ],
          "op": "and",
        },
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [
          {
            "49f3b33d-4ede-436c-8be9-a51619236916": 441,
            "a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850": 598623.2070000004,
            "c3583433-a2cc-4234-85ff-75ae2472b674": "中南",
          },
          {
            "49f3b33d-4ede-436c-8be9-a51619236916": 643,
            "a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850": 870384.3609999999,
            "c3583433-a2cc-4234-85ff-75ae2472b674": "华东",
          },
        ],
        "dimensions": [
          {
            "alias": "area",
            "encoding": "column",
            "id": "c3583433-a2cc-4234-85ff-75ae2472b674",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "sales",
            "encoding": "yAxis",
            "id": "a5ba6c4a-31dc-4b2c-a38f-9f23c2bbe850",
          },
          {
            "alias": "country_or_region",
            "encoding": "yAxis",
            "id": "49f3b33d-4ede-436c-8be9-a51619236916",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-field-not-in-measures-and-dimensions', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'line',
      dimensions: [],
      measures: [],
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
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.chartType.changeChartType('bar')
      builder.dimensions.add('area', (n) => n.setAlias('区域'))
      builder.measures.add('sales', (n) => n.setAlias('销售额').setEncoding('yAxis').setAggregate({ func: 'sum' }))
      builder.havingFilter.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100000))
      builder.limit.setLimit(20)
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "区域",
            "encoding": "yAxis",
            "field": "area",
            "id": "id-1",
          },
        ],
        "havingFilter": {
          "conditions": [
            {
              "aggregate": {
                "func": "sum",
              },
              "field": "profit",
              "id": "id-3",
              "op": "gt",
              "value": 100000,
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
            "id": "id-2",
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

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "profit",
              "op": "gt",
              "value": 100000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "orderBy": [
          {
            "field": "id-1",
            "order": "asc",
          },
        ],
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "sales",
          },
          {
            "alias": "id-1",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": "东北",
            "id-2": 2681567.469000001,
          },
          {
            "id-1": "中南",
            "id-2": 4137415.0929999948,
          },
          {
            "id-1": "华东",
            "id-2": 4684506.442,
          },
          {
            "id-1": "华北",
            "id-2": 2447301.017000004,
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-find-and-update', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter
        .add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100000))
        .add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(10000))
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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
              "id": "id-4",
              "op": "gte",
              "value": 500000,
            },
            {
              "aggregate": {
                "func": "sum",
              },
              "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "product_type",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "gte",
              "value": 500000,
            },
            {
              "aggr": {
                "func": "sum",
              },
              "field": "profit",
              "op": "gte",
              "value": 50000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "product_type",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "id-1": 4865589.791999991,
            "id-2": 757640.3519999951,
            "id-3": "办公用品",
          },
          {
            "id-1": 5734340.829,
            "id-2": 638735.6290000005,
            "id-3": "家具",
          },
          {
            "id-1": 5469023.503999994,
            "id-2": 751162.9440000018,
            "id-3": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "品类",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-group-add-to-existing', async () => {
    const builder = VBI.createChart({
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
                field: 'sales',
                op: 'gt',
                value: 500000,
                aggregate: {
                  func: 'sum',
                },
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100000))
        group.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gte').setValue(200))
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "cond-1",
                  "op": "gt",
                  "value": 500000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "id": "id-5",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "amount",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gt",
                  "value": 500000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "amount",
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
        "orderBy": [
          {
            "field": "id-4",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "alias": "id-4",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": 6463,
            "id-4": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": 9700,
            "id-4": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": 11041,
            "id-4": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": 5146,
            "id-4": "华北",
          },
          {
            "id-1": 815039.5959999998,
            "id-2": 98553.47600000004,
            "id-3": 1785,
            "id-4": "西北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": 3399,
            "id-4": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "yAxis",
            "id": "id-3",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-group-remove-condition', async () => {
    const builder = VBI.createChart({
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
                field: 'sales',
                op: 'gt',
                value: 100000,
                aggregate: {
                  func: 'sum',
                },
              },
              {
                id: 'cond-2',
                field: 'profit',
                op: 'gt',
                value: 10000,
                aggregate: {
                  func: 'sum',
                },
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.remove('cond-1')
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "product_type",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "id-1": 4865589.791999991,
            "id-2": 757640.3519999951,
            "id-3": "办公用品",
          },
          {
            "id-1": 5734340.829,
            "id-2": 638735.6290000005,
            "id-3": "家具",
          },
          {
            "id-1": 5469023.503999994,
            "id-2": 751162.9440000018,
            "id-3": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "品类",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-mix-filters-and-groups', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter
        .add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(500000))
        .addGroup('or', (group) => {
          group.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100000))
          group.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gte').setValue(30))
        })
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "sales",
              "id": "id-5",
              "op": "gt",
              "value": 500000,
            },
            {
              "conditions": [
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "id": "id-7",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "amount",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "sales",
              "op": "gt",
              "value": 500000,
            },
            {
              "conditions": [
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "op": "gt",
                  "value": 100000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "amount",
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
        "orderBy": [
          {
            "field": "id-4",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "alias": "id-4",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": 6463,
            "id-4": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": 9700,
            "id-4": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": 11041,
            "id-4": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": 5146,
            "id-4": "华北",
          },
          {
            "id-1": 815039.5959999998,
            "id-2": 98553.47600000004,
            "id-3": 1785,
            "id-4": "西北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": 3399,
            "id-4": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "yAxis",
            "id": "id-3",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-multi-dimension-aggregate', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.addGroup('and', (g) => {
        g.add('discount', (n) => n.setAggregate({ func: 'avg' }).setOperator('lt').setValue(0.2))
        g.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(100000))
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "avg",
                  },
                  "field": "discount",
                  "id": "id-6",
                  "op": "lt",
                  "value": 0.2,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "avg",
                  },
                  "field": "discount",
                  "op": "lt",
                  "value": 0.2,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
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
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "avg",
            },
            "alias": "id-2",
            "field": "discount",
          },
          {
            "alias": "id-3",
            "field": "product_type",
          },
          {
            "alias": "id-4",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 1270911.2639999979,
            "id-2": 0.07298387096774223,
            "id-3": "办公用品",
            "id-4": "中南",
          },
          {
            "id-1": 347692.57600000035,
            "id-2": 0.1015624999999998,
            "id-3": "办公用品",
            "id-4": "西南",
          },
          {
            "id-1": 824673.0519999993,
            "id-2": 0.11686615886833553,
            "id-3": "办公用品",
            "id-4": "东北",
          },
          {
            "id-1": 267870.7920000001,
            "id-2": 0.08030303030303029,
            "id-3": "办公用品",
            "id-4": "西北",
          },
          {
            "id-1": 745813.5159999988,
            "id-2": 0.043835616438356116,
            "id-3": "办公用品",
            "id-4": "华北",
          },
          {
            "id-1": 1408628.5919999965,
            "id-2": 0.09382716049382762,
            "id-3": "办公用品",
            "id-4": "华东",
          },
          {
            "id-1": 1676224.1299999976,
            "id-2": 0.14657534246575374,
            "id-3": "家具",
            "id-4": "华东",
          },
          {
            "id-1": 919743.9369999996,
            "id-2": 0.08083067092651754,
            "id-3": "家具",
            "id-4": "华北",
          },
          {
            "id-1": 1399928.2010000001,
            "id-2": 0.12799642218246884,
            "id-3": "家具",
            "id-4": "中南",
          },
          {
            "id-1": 501533.7320000001,
            "id-2": 0.19816513761467855,
            "id-3": "家具",
            "id-4": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "品类",
            "id": "id-3",
          },
          {
            "alias": "区域",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "平均折扣",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-nested-groups', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.addGroup('and', (outer) => {
        outer.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(1000000))
        outer.addGroup('or', (inner) => {
          inner.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(200000))
          inner.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gte').setValue(50))
        })
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "id-6",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "conditions": [
                    {
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "profit",
                      "id": "id-8",
                      "op": "gt",
                      "value": 200000,
                    },
                    {
                      "aggregate": {
                        "func": "sum",
                      },
                      "field": "amount",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "conditions": [
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "profit",
                      "op": "gt",
                      "value": 200000,
                    },
                    {
                      "aggr": {
                        "func": "sum",
                      },
                      "field": "amount",
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
        "orderBy": [
          {
            "field": "id-4",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "alias": "id-4",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": 6463,
            "id-4": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": 9700,
            "id-4": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": 11041,
            "id-4": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": 5146,
            "id-4": "华北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": 3399,
            "id-4": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "yAxis",
            "id": "id-3",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-or-group', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.addGroup('or', (group) => {
        group.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(1000000))
        group.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(200000))
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "id-5",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": "华北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-scatter-profit-analysis', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.addGroup('and', (g) => {
        g.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(0))
        g.add('amount', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(20))
        g.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(10000))
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "id": "id-6",
                  "op": "gt",
                  "value": 0,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "amount",
                  "id": "id-7",
                  "op": "gt",
                  "value": 20,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
                  "op": "gt",
                  "value": 0,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "amount",
                  "op": "gt",
                  "value": 20,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
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
        "orderBy": [
          {
            "field": "id-4",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "amount",
          },
          {
            "alias": "id-4",
            "field": "product_sub_type",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "scatter",
        "dataset": [
          {
            "id-1": 2307203.2200000025,
            "id-2": 361136.8599999998,
            "id-3": 2401,
            "id-4": "书架",
          },
          {
            "id-1": 287486.0799999999,
            "id-2": 72505.0200000001,
            "id-3": 2281,
            "id-4": "信封",
          },
          {
            "id-1": 2160183.0039999983,
            "id-2": 199027.02400000003,
            "id-3": 2134,
            "id-4": "器具",
          },
          {
            "id-1": 1991498.8800000001,
            "id-2": 252897.2600000002,
            "id-3": 2139,
            "id-4": "复印机",
          },
          {
            "id-1": 1152527.7399999981,
            "id-2": 316843.3799999997,
            "id-3": 2918,
            "id-4": "收纳具",
          },
          {
            "id-1": 97077.96000000005,
            "id-2": 23945.739999999943,
            "id-3": 2106,
            "id-4": "标签",
          },
          {
            "id-1": 2085435.967999999,
            "id-2": 325836.7279999995,
            "id-3": 3172,
            "id-4": "椅子",
          },
          {
            "id-1": 479691.2120000002,
            "id-2": 85167.71200000009,
            "id-3": 2298,
            "id-4": "用具",
          },
          {
            "id-1": 287970.48000000004,
            "id-2": 40576.339999999946,
            "id-3": 2266,
            "id-4": "用品",
          },
          {
            "id-1": 1799653.4640000009,
            "id-2": 223349.64399999977,
            "id-3": 2177,
            "id-4": "电话",
          },
        ],
        "dimensions": [
          {
            "alias": "子品类",
            "id": "id-4",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "xAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
          {
            "alias": "数量",
            "encoding": "size",
            "id": "id-3",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-update-group-operator', async () => {
    const builder = VBI.createChart({
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
                field: 'sales',
                op: 'gt',
                value: 1000000,
                aggregate: {
                  func: 'sum',
                },
              },
              {
                id: 'cond-2',
                field: 'profit',
                op: 'gt',
                value: 200000,
                aggregate: {
                  func: 'sum',
                },
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.updateGroup('group-1', (group) => {
        group.setOperator('or')
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "cond-1",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gt",
                  "value": 1000000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": "华北",
          },
          {
            "id-1": 1303124.508000002,
            "id-2": 97636.72800000008,
            "id-3": "西南",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('having-with-where-combined', async () => {
    const builder = VBI.createChart({
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

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.whereFilter.add('product_type', (n) => n.setOperator('=').setValue('办公用品'))
      builder.havingFilter.addGroup('or', (g) => {
        g.add('sales', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(50000))
        g.add('profit', (n) => n.setAggregate({ func: 'sum' }).setOperator('gt').setValue(10000))
      })
    }
    applyBuilder(builder)

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
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "id": "id-6",
                  "op": "gt",
                  "value": 50000,
                },
                {
                  "aggregate": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "uuid": "uuid-1",
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
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "sales",
                  "op": "gt",
                  "value": 50000,
                },
                {
                  "aggr": {
                    "func": "sum",
                  },
                  "field": "profit",
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
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
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

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "id-1": 197696.65999999997,
            "id-2": 35229.46,
            "id-3": "上海",
          },
          {
            "id-1": 93548.7,
            "id-2": 20973.82,
            "id-3": "云南",
          },
          {
            "id-1": 114192.17600000004,
            "id-2": -15815.184,
            "id-3": "内蒙古",
          },
          {
            "id-1": 146253.80000000002,
            "id-2": 24618.859999999982,
            "id-3": "北京",
          },
          {
            "id-1": 119124.93600000005,
            "id-2": 26063.436,
            "id-3": "吉林",
          },
          {
            "id-1": 114141.496,
            "id-2": -6415.164000000001,
            "id-3": "四川",
          },
          {
            "id-1": 143225.31999999998,
            "id-2": 38900.960000000014,
            "id-3": "天津",
          },
          {
            "id-1": 192031.5600000002,
            "id-2": 43450.12000000001,
            "id-3": "安徽",
          },
          {
            "id-1": 490581.2800000006,
            "id-2": 128908.9200000001,
            "id-3": "山东",
          },
          {
            "id-1": 116742.35999999999,
            "id-2": 27574.540000000005,
            "id-3": "山西",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('remove-having-filter', async () => {
    const builder = VBI.createChart({
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
            field: 'sales',
            op: 'gt',
            value: 1000000,
            aggregate: {
              func: 'sum',
            },
          },
          {
            id: 'having-2',
            field: 'profit',
            op: 'gt',
            value: 200000,
            aggregate: {
              func: 'sum',
            },
          },
        ],
      },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.havingFilter.remove('having-1')
    }
    applyBuilder(builder)

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
              "aggregate": {
                "func": "sum",
              },
              "field": "profit",
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
        "uuid": "uuid-1",
        "version": 1,
        "whereFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
      }
    `)

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "having": {
          "conditions": [
            {
              "aggr": {
                "func": "sum",
              },
              "field": "profit",
              "op": "gt",
              "value": 200000,
            },
          ],
          "op": "and",
        },
        "limit": 20,
        "orderBy": [
          {
            "field": "id-3",
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
          },
          {
            "alias": "id-3",
            "field": "area",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 2681567.469000001,
            "id-2": 242191.50899999973,
            "id-3": "东北",
          },
          {
            "id-1": 4137415.0929999948,
            "id-2": 670885.313,
            "id-3": "中南",
          },
          {
            "id-1": 4684506.442,
            "id-2": 607218.6819999996,
            "id-3": "华东",
          },
          {
            "id-1": 2447301.017000004,
            "id-2": 431053.2169999998,
            "id-3": "华北",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-3",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })
})
