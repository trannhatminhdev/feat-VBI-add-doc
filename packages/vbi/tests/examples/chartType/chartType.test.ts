import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('ChartType', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('area-by-order-date', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'area',
      dimensions: [
        {
          field: 'order_date',
          alias: '订单日期',
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
      builder.chartType.changeChartType('line')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "line",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "订单日期",
            "field": "order_date",
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
          "order_date",
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
            "alias": "订单日期",
            "field": "order_date",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "line",
        "dataset": [
          {
            "订单日期": "2019-04-27",
            "销售额": 1177.9040000000002,
          },
          {
            "订单日期": "2019-06-15",
            "销售额": 37081.73,
          },
          {
            "订单日期": "2019-06-16",
            "销售额": 680.456,
          },
          {
            "订单日期": "2019-12-09",
            "销售额": 13185.676,
          },
          {
            "订单日期": "2018-05-31",
            "销售额": 13957.887999999999,
          },
          {
            "订单日期": "2017-10-27",
            "销售额": 38545.556000000004,
          },
          {
            "订单日期": "2016-12-22",
            "销售额": 8793.96,
          },
          {
            "订单日期": "2019-06-01",
            "销售额": 18953.983999999997,
          },
          {
            "订单日期": "2017-06-05",
            "销售额": 18350.640000000003,
          },
          {
            "订单日期": "2018-11-22",
            "销售额": 52784.92800000001,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('bar-by-product-type', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'product_type',
          alias: '产品类型',
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
      builder.chartType.changeChartType('column')
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
            "alias": "产品类型",
            "field": "product_type",
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
            "encoding": "xAxis",
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
          "product_type",
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
        "chartType": "column",
        "dataset": [
          {
            "产品类型": "办公用品",
            "销售额": 4865589.791999991,
          },
          {
            "产品类型": "技术",
            "销售额": 5469023.503999994,
          },
          {
            "产品类型": "家具",
            "销售额": 5734340.829,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('chart-type-switching', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'line',
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
      builder.chartType.changeChartType('columnParallel')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "columnParallel",
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
        "chartType": "columnParallel",
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

  it('column-by-area', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
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
      limit: 10,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.chartType.changeChartType('bar')
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
          "area",
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
            "区域": "西北",
            "销售额": 815039.5959999998,
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

  it('donut-by-customer-type', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'donut',
      dimensions: [
        {
          field: 'customer_type',
          alias: '客户类型',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'size',
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
      builder.chartType.changeChartType('pie')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "客户类型",
            "field": "customer_type",
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
            "encoding": "size",
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
          "customer_type",
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
            "alias": "客户类型",
            "field": "customer_type",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "dataset": [
          {
            "客户类型": "公司",
            "销售额": 5152793.296000013,
          },
          {
            "客户类型": "消费者",
            "销售额": 8025072.187999996,
          },
          {
            "客户类型": "小型企业",
            "销售额": 2891088.6410000017,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('line-by-province', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'line',
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
      builder.chartType.changeChartType('area')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
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
        "chartType": "area",
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

  it('line-chart', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'line',
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
      builder.chartType.changeChartType('area')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
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
        "chartType": "area",
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

  it('pie-by-area', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'pie',
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
          encoding: 'size',
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
      builder.chartType.changeChartType('donut')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "donut",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "区域",
            "field": "area",
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
            "encoding": "size",
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
        "chartType": "donut",
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
            "区域": "西北",
            "销售额": 815039.5959999998,
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

  it('rose-by-city', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'rose',
      dimensions: [
        {
          field: 'city',
          alias: '城市',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'size',
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
      builder.chartType.changeChartType('pie')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "城市",
            "field": "city",
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
            "encoding": "size",
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
          "city",
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
            "alias": "城市",
            "field": "city",
          },
        ],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "dataset": [
          {
            "城市": "杭州",
            "销售额": 108758.94400000008,
          },
          {
            "城市": "内江",
            "销售额": 43502.787999999986,
          },
          {
            "城市": "镇江",
            "销售额": 12133.044000000002,
          },
          {
            "城市": "汕头",
            "销售额": 118704.57199999999,
          },
          {
            "城市": "景德镇",
            "销售额": 68907.3,
          },
          {
            "城市": "榆林",
            "销售额": 42384.72,
          },
          {
            "城市": "哈尔滨",
            "销售额": 205688.23099999994,
          },
          {
            "城市": "青岛",
            "销售额": 206316.264,
          },
          {
            "城市": "徐州",
            "销售额": 89802.636,
          },
          {
            "城市": "上海",
            "销售额": 582450.5679999999,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('scatter-sales-profit', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'scatter',
      dimensions: [],
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
      builder.chartType.changeChartType('bar')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilters": [],
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
        "groupBy": [],
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
            "利润": 2147538.9250000017,
            "销售额": 16068954.12500003,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
