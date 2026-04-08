import { rs } from '@rstest/core'
import { VBI, VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('Dimensions', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('add-date-dimension-year', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
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
    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.dimensions.add('order_date', (node) => {
        node.setAlias('订单日期')
      })
      const dimensionId = builder.dimensions.find((node) => node.getField() === 'order_date')?.getId()
      if (dimensionId) {
        builder.dimensions.update(dimensionId, (node) => {
          node.setAlias('年份').setAggregate({ func: 'toYear' })
        })
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
            "aggregate": {
              "func": "toYear",
            },
            "alias": "年份",
            "encoding": "column",
            "field": "order_date",
            "id": "id-2",
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
          "id-2",
        ],
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
            "aggr": {
              "func": "to_year",
            },
            "alias": "id-2",
            "field": "order_date",
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
            "id-1": 2931056.4149999986,
            "id-2": "2016",
          },
          {
            "id-1": 3431919.4629999986,
            "id-2": "2017",
          },
          {
            "id-1": 4243539.8599999985,
            "id-2": "2018",
          },
          {
            "id-1": 5462438.386999988,
            "id-2": "2019",
          },
        ],
        "dimensions": [
          {
            "alias": "年份",
            "encoding": "column",
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

  it('add-dimension', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.dimensions.add('product_type', (node) => {
        node.setAlias('商品类型')
      })
      const dimensionId = builder.dimensions.find((node) => node.getField() === 'product_type')?.getId()
      if (dimensionId) {
        builder.dimensions.update(dimensionId, (node) => {
          node.setAlias('产品类型')
        })
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
            "alias": "产品类型",
            "encoding": "column",
            "field": "product_type",
            "id": "id-1",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
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
          "product_type",
        ],
        "limit": 20,
        "orderBy": [
          {
            "field": "id-1",
            "order": "asc",
          },
        ],
        "select": [
          {
            "alias": "id-1",
            "field": "product_type",
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
            "id-1": "办公用品",
          },
          {
            "id-1": "家具",
          },
          {
            "id-1": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "column",
            "id": "id-1",
          },
        ],
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
      }
    `)
  })

  it('add-multiple-dimensions', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.dimensions.add('product_type', (n) => n.setAlias('产品类型')).add('province', (n) => n.setAlias('省份'))
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
            "alias": "产品类型",
            "encoding": "column",
            "field": "product_type",
            "id": "id-1",
          },
          {
            "alias": "省份",
            "encoding": "column",
            "field": "province",
            "id": "id-2",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
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
          "product_type",
          "province",
        ],
        "limit": 20,
        "orderBy": [
          {
            "field": "id-1",
            "order": "asc",
          },
        ],
        "select": [
          {
            "alias": "id-1",
            "field": "product_type",
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
            "id-1": "办公用品",
            "id-2": "河北",
          },
          {
            "id-1": "办公用品",
            "id-2": "安徽",
          },
          {
            "id-1": "办公用品",
            "id-2": "江西",
          },
          {
            "id-1": "办公用品",
            "id-2": "辽宁",
          },
          {
            "id-1": "办公用品",
            "id-2": "山东",
          },
          {
            "id-1": "办公用品",
            "id-2": "吉林",
          },
          {
            "id-1": "办公用品",
            "id-2": "江苏",
          },
          {
            "id-1": "办公用品",
            "id-2": "湖北",
          },
          {
            "id-1": "办公用品",
            "id-2": "浙江",
          },
          {
            "id-1": "办公用品",
            "id-2": "陕西",
          },
          {
            "id-1": "办公用品",
            "id-2": "四川",
          },
          {
            "id-1": "办公用品",
            "id-2": "北京",
          },
          {
            "id-1": "办公用品",
            "id-2": "上海",
          },
          {
            "id-1": "办公用品",
            "id-2": "湖南",
          },
          {
            "id-1": "办公用品",
            "id-2": "黑龙江",
          },
          {
            "id-1": "办公用品",
            "id-2": "重庆",
          },
          {
            "id-1": "办公用品",
            "id-2": "广东",
          },
          {
            "id-1": "办公用品",
            "id-2": "甘肃",
          },
          {
            "id-1": "办公用品",
            "id-2": "福建",
          },
          {
            "id-1": "办公用品",
            "id-2": "青海",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "column",
            "id": "id-1",
          },
          {
            "alias": "省份",
            "encoding": "column",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
      }
    `)
  })

  it('mixed-date-and-normal-dimensions', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
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
    const applyBuilder = (builder: VBIChartBuilder) => {
      builder.dimensions
        .add('area', (node) => {
          node.setAlias('区域')
        })
        .add('order_date', (node) => {
          node.setAlias('季度').setAggregate({ func: 'toQuarter' })
        })
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
            "alias": "区域",
            "encoding": "column",
            "field": "area",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "toQuarter",
            },
            "alias": "季度",
            "encoding": "column",
            "field": "order_date",
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
          "area",
          "id-3",
        ],
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
          {
            "aggr": {
              "func": "to_quarter",
            },
            "alias": "id-3",
            "field": "order_date",
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
            "id-1": 186838.274,
            "id-2": "东北",
            "id-3": "2019-Q1",
          },
          {
            "id-1": 146340.09599999993,
            "id-2": "东北",
            "id-3": "2018-Q2",
          },
          {
            "id-1": 155194.30500000002,
            "id-2": "东北",
            "id-3": "2016-Q3",
          },
          {
            "id-1": 205112.1240000001,
            "id-2": "东北",
            "id-3": "2016-Q4",
          },
          {
            "id-1": 122472.36400000005,
            "id-2": "东北",
            "id-3": "2017-Q3",
          },
          {
            "id-1": 272311.2490000001,
            "id-2": "东北",
            "id-3": "2019-Q3",
          },
          {
            "id-1": 231538.68499999982,
            "id-2": "东北",
            "id-3": "2018-Q4",
          },
          {
            "id-1": 65768.612,
            "id-2": "东北",
            "id-3": "2016-Q2",
          },
          {
            "id-1": 176753.35299999997,
            "id-2": "东北",
            "id-3": "2018-Q1",
          },
          {
            "id-1": 73930.72400000002,
            "id-2": "东北",
            "id-3": "2016-Q1",
          },
          {
            "id-1": 71784.10400000002,
            "id-2": "东北",
            "id-3": "2017-Q1",
          },
          {
            "id-1": 99761.45199999999,
            "id-2": "东北",
            "id-3": "2017-Q2",
          },
          {
            "id-1": 255989.503,
            "id-2": "东北",
            "id-3": "2019-Q4",
          },
          {
            "id-1": 200039.616,
            "id-2": "东北",
            "id-3": "2018-Q3",
          },
          {
            "id-1": 181868.45600000003,
            "id-2": "东北",
            "id-3": "2017-Q4",
          },
          {
            "id-1": 235864.55199999994,
            "id-2": "东北",
            "id-3": "2019-Q2",
          },
          {
            "id-1": 226991.00199999992,
            "id-2": "中南",
            "id-3": "2016-Q4",
          },
          {
            "id-1": 423233.699,
            "id-2": "中南",
            "id-3": "2019-Q2",
          },
          {
            "id-1": 277594.34499999974,
            "id-2": "中南",
            "id-3": "2018-Q3",
          },
          {
            "id-1": 391938.02200000023,
            "id-2": "中南",
            "id-3": "2019-Q3",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "encoding": "column",
            "id": "id-2",
          },
          {
            "alias": "季度",
            "encoding": "column",
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
        ],
        "theme": "light",
      }
    `)
  })

  it('remove-dimension', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'product_type',
          alias: '产品类型',
        },
        {
          field: 'province',
          alias: '省份',
        },
      ],
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const dimensionId = builder.dimensions.toJSON().find((item) => item.field === 'product_type')?.id
      if (dimensionId) {
        builder.dimensions.update(dimensionId, (node) => {
          node.setAlias('待删除的产品类型')
        })
        builder.dimensions.remove(dimensionId)
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
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
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
        "limit": 20,
        "orderBy": [
          {
            "field": "id-2",
            "order": "asc",
          },
        ],
        "select": [
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
            "id-2": "上海",
          },
          {
            "id-2": "云南",
          },
          {
            "id-2": "内蒙古",
          },
          {
            "id-2": "北京",
          },
          {
            "id-2": "吉林",
          },
          {
            "id-2": "四川",
          },
          {
            "id-2": "天津",
          },
          {
            "id-2": "宁夏",
          },
          {
            "id-2": "安徽",
          },
          {
            "id-2": "山东",
          },
          {
            "id-2": "山西",
          },
          {
            "id-2": "广东",
          },
          {
            "id-2": "广西",
          },
          {
            "id-2": "新疆",
          },
          {
            "id-2": "江苏",
          },
          {
            "id-2": "江西",
          },
          {
            "id-2": "河北",
          },
          {
            "id-2": "河南",
          },
          {
            "id-2": "浙江",
          },
          {
            "id-2": "海南",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
      }
    `)
  })

  it('update-date-dimension-month', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'order_date',
          alias: '原订单日期',
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
    const applyBuilder = (builder: VBIChartBuilder) => {
      const dimensionId = builder.dimensions.toJSON().find((item) => item.field === 'order_date')?.id
      if (dimensionId) {
        const dimension = builder.dimensions.find((node) => node.getId() === dimensionId)
        if (dimension) {
          dimension.setAlias('待调整的订单日期')
        }
        builder.dimensions.update(dimensionId, (node) => {
          node.setAlias('月份').setAggregate({ func: 'toMonth' })
        })
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
            "aggregate": {
              "func": "toMonth",
            },
            "alias": "月份",
            "field": "order_date",
            "id": "id-2",
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
          "id-2",
        ],
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
            "aggr": {
              "func": "to_month",
            },
            "alias": "id-2",
            "field": "order_date",
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
            "id-1": 231597.61799999993,
            "id-2": "2016-01",
          },
          {
            "id-1": 104936.37,
            "id-2": "2016-02",
          },
          {
            "id-1": 167173.72700000007,
            "id-2": "2016-03",
          },
          {
            "id-1": 96052.85200000001,
            "id-2": "2016-04",
          },
          {
            "id-1": 232199.1070000001,
            "id-2": "2016-05",
          },
          {
            "id-1": 339729.69799999986,
            "id-2": "2016-06",
          },
          {
            "id-1": 140050.918,
            "id-2": "2016-07",
          },
          {
            "id-1": 356128.50699999987,
            "id-2": "2016-08",
          },
          {
            "id-1": 320606.16699999996,
            "id-2": "2016-09",
          },
          {
            "id-1": 283747.2890000001,
            "id-2": "2016-10",
          },
          {
            "id-1": 342142.15000000014,
            "id-2": "2016-11",
          },
          {
            "id-1": 316692.012,
            "id-2": "2016-12",
          },
          {
            "id-1": 173124.53900000002,
            "id-2": "2017-01",
          },
          {
            "id-1": 117715.50000000006,
            "id-2": "2017-02",
          },
          {
            "id-1": 194867.50500000003,
            "id-2": "2017-03",
          },
          {
            "id-1": 128719.24800000008,
            "id-2": "2017-04",
          },
          {
            "id-1": 428335.74700000015,
            "id-2": "2017-05",
          },
          {
            "id-1": 343329.7279999998,
            "id-2": "2017-06",
          },
          {
            "id-1": 178725.02200000006,
            "id-2": "2017-07",
          },
          {
            "id-1": 425111.89699999994,
            "id-2": "2017-08",
          },
        ],
        "dimensions": [
          {
            "alias": "月份",
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

  it('update-dimension', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'product_type',
          alias: '原产品类型',
        },
      ],
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const dimensionId = builder.dimensions.toJSON().find((item) => item.field === 'product_type')?.id
      if (dimensionId) {
        const dimension = builder.dimensions.find((node) => node.getId() === dimensionId)
        if (dimension) {
          dimension.setAlias('待调整的产品类型')
        }
        builder.dimensions.update(dimensionId, (n) => n.setAlias('新产品类型'))
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
            "alias": "新产品类型",
            "field": "product_type",
            "id": "id-1",
          },
        ],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
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
          "product_type",
        ],
        "limit": 20,
        "orderBy": [
          {
            "field": "id-1",
            "order": "asc",
          },
        ],
        "select": [
          {
            "alias": "id-1",
            "field": "product_type",
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
            "id-1": "办公用品",
          },
          {
            "id-1": "家具",
          },
          {
            "id-1": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "新产品类型",
            "id": "id-1",
          },
        ],
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
      }
    `)
  })
})
