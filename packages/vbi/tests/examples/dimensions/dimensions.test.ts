import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Dimensions', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('add-date-dimension-year', async () => {
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "id-1": 5462438.386999988,
            "id-2": "2019",
          },
          {
            "id-1": 4243539.8599999985,
            "id-2": "2018",
          },
          {
            "id-1": 3431919.4629999986,
            "id-2": "2017",
          },
          {
            "id-1": 2931056.4149999986,
            "id-2": "2016",
          },
        ],
        "dimensions": [
          {
            "alias": "年份",
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
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "id-1": "技术",
          },
          {
            "id-1": "家具",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
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
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "field": "product_type",
            "id": "id-1",
          },
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
            "id-2": "浙江",
          },
          {
            "id-1": "办公用品",
            "id-2": "四川",
          },
          {
            "id-1": "办公用品",
            "id-2": "江苏",
          },
          {
            "id-1": "办公用品",
            "id-2": "广东",
          },
          {
            "id-1": "技术",
            "id-2": "江西",
          },
          {
            "id-1": "办公用品",
            "id-2": "江西",
          },
          {
            "id-1": "家具",
            "id-2": "江西",
          },
          {
            "id-1": "技术",
            "id-2": "陕西",
          },
          {
            "id-1": "技术",
            "id-2": "黑龙江",
          },
          {
            "id-1": "办公用品",
            "id-2": "山东",
          },
          {
            "id-1": "技术",
            "id-2": "山东",
          },
          {
            "id-1": "技术",
            "id-2": "上海",
          },
          {
            "id-1": "办公用品",
            "id-2": "上海",
          },
          {
            "id-1": "家具",
            "id-2": "浙江",
          },
          {
            "id-1": "技术",
            "id-2": "浙江",
          },
          {
            "id-1": "办公用品",
            "id-2": "河北",
          },
          {
            "id-1": "家具",
            "id-2": "河北",
          },
          {
            "id-1": "家具",
            "id-2": "上海",
          },
          {
            "id-1": "办公用品",
            "id-2": "福建",
          },
          {
            "id-1": "办公用品",
            "id-2": "安徽",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
            "id": "id-1",
          },
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

  it('mixed-date-and-normal-dimensions', async () => {
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "field": "area",
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "toQuarter",
            },
            "alias": "季度",
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
            "id-1": 451368.918,
            "id-2": "华东",
            "id-3": "2019-Q2",
          },
          {
            "id-1": 94383.46400000002,
            "id-2": "西南",
            "id-3": "2019-Q2",
          },
          {
            "id-1": 477366.87599999976,
            "id-2": "华东",
            "id-3": "2019-Q4",
          },
          {
            "id-1": 269415.7270000001,
            "id-2": "中南",
            "id-3": "2018-Q2",
          },
          {
            "id-1": 324136.48400000005,
            "id-2": "华东",
            "id-3": "2017-Q4",
          },
          {
            "id-1": 55664.028,
            "id-2": "西北",
            "id-3": "2016-Q4",
          },
          {
            "id-1": 235864.55199999994,
            "id-2": "东北",
            "id-3": "2019-Q2",
          },
          {
            "id-1": 285955.20800000004,
            "id-2": "华东",
            "id-3": "2017-Q2",
          },
          {
            "id-1": 468974.0159999999,
            "id-2": "华东",
            "id-3": "2018-Q4",
          },
          {
            "id-1": 362820.17100000003,
            "id-2": "华东",
            "id-3": "2018-Q2",
          },
          {
            "id-1": 198940.55999999994,
            "id-2": "华北",
            "id-3": "2019-Q3",
          },
          {
            "id-1": 141021.44,
            "id-2": "华东",
            "id-3": "2018-Q1",
          },
          {
            "id-1": 362395.21500000014,
            "id-2": "华东",
            "id-3": "2018-Q3",
          },
          {
            "id-1": 62270.432,
            "id-2": "西北",
            "id-3": "2018-Q3",
          },
          {
            "id-1": 231538.68499999982,
            "id-2": "东北",
            "id-3": "2018-Q4",
          },
          {
            "id-1": 135671.99800000002,
            "id-2": "华东",
            "id-3": "2016-Q2",
          },
          {
            "id-1": 75548.56400000001,
            "id-2": "西南",
            "id-3": "2018-Q2",
          },
          {
            "id-1": 342589.303,
            "id-2": "中南",
            "id-3": "2018-Q4",
          },
          {
            "id-1": 94806.62800000001,
            "id-2": "西北",
            "id-3": "2019-Q4",
          },
          {
            "id-1": 209217.869,
            "id-2": "中南",
            "id-3": "2016-Q3",
          },
        ],
        "dimensions": [
          {
            "alias": "区域",
            "id": "id-2",
          },
          {
            "alias": "季度",
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
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "id-2": "浙江",
          },
          {
            "id-2": "四川",
          },
          {
            "id-2": "江苏",
          },
          {
            "id-2": "广东",
          },
          {
            "id-2": "江西",
          },
          {
            "id-2": "陕西",
          },
          {
            "id-2": "黑龙江",
          },
          {
            "id-2": "山东",
          },
          {
            "id-2": "上海",
          },
          {
            "id-2": "河北",
          },
          {
            "id-2": "福建",
          },
          {
            "id-2": "安徽",
          },
          {
            "id-2": "甘肃",
          },
          {
            "id-2": "吉林",
          },
          {
            "id-2": "辽宁",
          },
          {
            "id-2": "湖北",
          },
          {
            "id-2": "河南",
          },
          {
            "id-2": "湖南",
          },
          {
            "id-2": "北京",
          },
          {
            "id-2": "重庆",
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
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "id-1": 333398.31699999975,
            "id-2": "2019-04",
          },
          {
            "id-1": 565252.527,
            "id-2": "2019-06",
          },
          {
            "id-1": 544539.1000000007,
            "id-2": "2019-12",
          },
          {
            "id-1": 399122.28999999986,
            "id-2": "2018-05",
          },
          {
            "id-1": 360630.03199999983,
            "id-2": "2017-10",
          },
          {
            "id-1": 316692.012,
            "id-2": "2016-12",
          },
          {
            "id-1": 343329.7279999998,
            "id-2": "2017-06",
          },
          {
            "id-1": 526724.9120000001,
            "id-2": "2018-11",
          },
          {
            "id-1": 577450.3210000001,
            "id-2": "2019-10",
          },
          {
            "id-1": 442849.64500000037,
            "id-2": "2018-06",
          },
          {
            "id-1": 502799.2550000003,
            "id-2": "2019-09",
          },
          {
            "id-1": 190255.56199999998,
            "id-2": "2018-02",
          },
          {
            "id-1": 463353.0720000005,
            "id-2": "2018-09",
          },
          {
            "id-1": 224137.26299999992,
            "id-2": "2018-07",
          },
          {
            "id-1": 462728.035,
            "id-2": "2018-12",
          },
          {
            "id-1": 232199.1070000001,
            "id-2": "2016-05",
          },
          {
            "id-1": 484792.97300000006,
            "id-2": "2018-10",
          },
          {
            "id-1": 468822.5429999997,
            "id-2": "2019-11",
          },
          {
            "id-1": 356128.50699999987,
            "id-2": "2016-08",
          },
          {
            "id-1": 231597.61799999993,
            "id-2": "2016-01",
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
    const builder = VBI.from({
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
    const applyBuilder = (builder: VBIBuilder) => {
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
            "id-1": "技术",
          },
          {
            "id-1": "家具",
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
