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
          "年份",
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
              "func": "to_year",
            },
            "alias": "年份",
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
            "年份": "2019",
            "销售额": 5462438.386999988,
          },
          {
            "年份": "2018",
            "销售额": 4243539.8599999985,
          },
          {
            "年份": "2017",
            "销售额": 3431919.4629999986,
          },
          {
            "年份": "2016",
            "销售额": 2931056.4149999986,
          },
        ],
        "locale": "zh-CN",
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
            "alias": "产品类型",
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
            "产品类型": "办公用品",
          },
          {
            "产品类型": "技术",
          },
          {
            "产品类型": "家具",
          },
        ],
        "locale": "zh-CN",
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
            "alias": "产品类型",
            "field": "product_type",
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
            "产品类型": "办公用品",
            "省份": "浙江",
          },
          {
            "产品类型": "办公用品",
            "省份": "四川",
          },
          {
            "产品类型": "办公用品",
            "省份": "江苏",
          },
          {
            "产品类型": "办公用品",
            "省份": "广东",
          },
          {
            "产品类型": "技术",
            "省份": "江西",
          },
          {
            "产品类型": "办公用品",
            "省份": "江西",
          },
          {
            "产品类型": "家具",
            "省份": "江西",
          },
          {
            "产品类型": "技术",
            "省份": "陕西",
          },
          {
            "产品类型": "技术",
            "省份": "黑龙江",
          },
          {
            "产品类型": "办公用品",
            "省份": "山东",
          },
          {
            "产品类型": "技术",
            "省份": "山东",
          },
          {
            "产品类型": "技术",
            "省份": "上海",
          },
          {
            "产品类型": "办公用品",
            "省份": "上海",
          },
          {
            "产品类型": "家具",
            "省份": "浙江",
          },
          {
            "产品类型": "技术",
            "省份": "浙江",
          },
          {
            "产品类型": "办公用品",
            "省份": "河北",
          },
          {
            "产品类型": "家具",
            "省份": "河北",
          },
          {
            "产品类型": "家具",
            "省份": "上海",
          },
          {
            "产品类型": "办公用品",
            "省份": "福建",
          },
          {
            "产品类型": "办公用品",
            "省份": "安徽",
          },
        ],
        "locale": "zh-CN",
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
          "季度",
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
            "alias": "区域",
            "field": "area",
          },
          {
            "aggr": {
              "func": "to_quarter",
            },
            "alias": "季度",
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
            "区域": "华东",
            "季度": "2019-Q2",
            "销售额": 451368.918,
          },
          {
            "区域": "西南",
            "季度": "2019-Q2",
            "销售额": 94383.46400000002,
          },
          {
            "区域": "华东",
            "季度": "2019-Q4",
            "销售额": 477366.87599999976,
          },
          {
            "区域": "中南",
            "季度": "2018-Q2",
            "销售额": 269415.7270000001,
          },
          {
            "区域": "华东",
            "季度": "2017-Q4",
            "销售额": 324136.48400000005,
          },
          {
            "区域": "西北",
            "季度": "2016-Q4",
            "销售额": 55664.028,
          },
          {
            "区域": "东北",
            "季度": "2019-Q2",
            "销售额": 235864.55199999994,
          },
          {
            "区域": "华东",
            "季度": "2017-Q2",
            "销售额": 285955.20800000004,
          },
          {
            "区域": "华东",
            "季度": "2018-Q4",
            "销售额": 468974.0159999999,
          },
          {
            "区域": "华东",
            "季度": "2018-Q2",
            "销售额": 362820.17100000003,
          },
          {
            "区域": "华北",
            "季度": "2019-Q3",
            "销售额": 198940.55999999994,
          },
          {
            "区域": "华东",
            "季度": "2018-Q1",
            "销售额": 141021.44,
          },
          {
            "区域": "华东",
            "季度": "2018-Q3",
            "销售额": 362395.21500000014,
          },
          {
            "区域": "西北",
            "季度": "2018-Q3",
            "销售额": 62270.432,
          },
          {
            "区域": "东北",
            "季度": "2018-Q4",
            "销售额": 231538.68499999982,
          },
          {
            "区域": "华东",
            "季度": "2016-Q2",
            "销售额": 135671.99800000002,
          },
          {
            "区域": "西南",
            "季度": "2018-Q2",
            "销售额": 75548.56400000001,
          },
          {
            "区域": "中南",
            "季度": "2018-Q4",
            "销售额": 342589.303,
          },
          {
            "区域": "西北",
            "季度": "2019-Q4",
            "销售额": 94806.62800000001,
          },
          {
            "区域": "中南",
            "季度": "2016-Q3",
            "销售额": 209217.869,
          },
        ],
        "locale": "zh-CN",
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
          },
          {
            "省份": "四川",
          },
          {
            "省份": "江苏",
          },
          {
            "省份": "广东",
          },
          {
            "省份": "江西",
          },
          {
            "省份": "陕西",
          },
          {
            "省份": "黑龙江",
          },
          {
            "省份": "山东",
          },
          {
            "省份": "上海",
          },
          {
            "省份": "河北",
          },
          {
            "省份": "福建",
          },
          {
            "省份": "安徽",
          },
          {
            "省份": "甘肃",
          },
          {
            "省份": "吉林",
          },
          {
            "省份": "辽宁",
          },
          {
            "省份": "湖北",
          },
          {
            "省份": "河南",
          },
          {
            "省份": "湖南",
          },
          {
            "省份": "北京",
          },
          {
            "省份": "重庆",
          },
        ],
        "locale": "zh-CN",
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
          "月份",
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
              "func": "to_month",
            },
            "alias": "月份",
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
            "月份": "2019-04",
            "销售额": 333398.31699999975,
          },
          {
            "月份": "2019-06",
            "销售额": 565252.527,
          },
          {
            "月份": "2019-12",
            "销售额": 544539.1000000007,
          },
          {
            "月份": "2018-05",
            "销售额": 399122.28999999986,
          },
          {
            "月份": "2017-10",
            "销售额": 360630.03199999983,
          },
          {
            "月份": "2016-12",
            "销售额": 316692.012,
          },
          {
            "月份": "2017-06",
            "销售额": 343329.7279999998,
          },
          {
            "月份": "2018-11",
            "销售额": 526724.9120000001,
          },
          {
            "月份": "2019-10",
            "销售额": 577450.3210000001,
          },
          {
            "月份": "2018-06",
            "销售额": 442849.64500000037,
          },
          {
            "月份": "2019-09",
            "销售额": 502799.2550000003,
          },
          {
            "月份": "2018-02",
            "销售额": 190255.56199999998,
          },
          {
            "月份": "2018-09",
            "销售额": 463353.0720000005,
          },
          {
            "月份": "2018-07",
            "销售额": 224137.26299999992,
          },
          {
            "月份": "2018-12",
            "销售额": 462728.035,
          },
          {
            "月份": "2016-05",
            "销售额": 232199.1070000001,
          },
          {
            "月份": "2018-10",
            "销售额": 484792.97300000006,
          },
          {
            "月份": "2019-11",
            "销售额": 468822.5429999997,
          },
          {
            "月份": "2016-08",
            "销售额": 356128.50699999987,
          },
          {
            "月份": "2016-01",
            "销售额": 231597.61799999993,
          },
        ],
        "locale": "zh-CN",
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
            "alias": "新产品类型",
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
            "新产品类型": "办公用品",
          },
          {
            "新产品类型": "技术",
          },
          {
            "新产品类型": "家具",
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
