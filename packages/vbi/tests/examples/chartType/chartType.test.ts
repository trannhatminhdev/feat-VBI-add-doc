import { rs } from '@rstest/core'
import { VBI, type VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('chart / ChartType', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('area-by-order-date', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('line')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "line",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "订单日期",
            "encoding": "xAxis",
            "field": "order_date",
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
          "order_date",
        ],
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
            "field": "order_date",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "line",
        "dataset": [
          {
            "id-1": 11926.25,
            "id-2": "2016-01-01",
          },
          {
            "id-1": 32997.16,
            "id-2": "2016-01-02",
          },
          {
            "id-1": 17063.172000000002,
            "id-2": "2016-01-03",
          },
          {
            "id-1": 7793.184,
            "id-2": "2016-01-04",
          },
          {
            "id-1": 9312.184000000001,
            "id-2": "2016-01-05",
          },
          {
            "id-1": 581.28,
            "id-2": "2016-01-06",
          },
          {
            "id-1": 10033.155999999999,
            "id-2": "2016-01-07",
          },
          {
            "id-1": 4205.572,
            "id-2": "2016-01-08",
          },
          {
            "id-1": 8415.372,
            "id-2": "2016-01-09",
          },
          {
            "id-1": 853.8600000000001,
            "id-2": "2016-01-10",
          },
        ],
        "dimensions": [
          {
            "alias": "订单日期",
            "encoding": "xAxis",
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

  it('bar-by-product-type', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('column')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "xAxis",
            "field": "product_type",
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
            "id-2": "办公用品",
          },
          {
            "id-1": 5734340.829,
            "id-2": "家具",
          },
          {
            "id-1": 5469023.503999994,
            "id-2": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "xAxis",
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

  it('chart-type-switching', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('columnParallel')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "columnParallel",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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
            "field": "province",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "columnParallel",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": "云南",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": "吉林",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 58121,
            "id-2": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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

  it('column-by-area', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('bar')
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
            "encoding": "xAxis",
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
            "encoding": "yAxis",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "xAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('donut-by-customer-type', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('pie')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "客户类型",
            "encoding": "color",
            "field": "customer_type",
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
            "encoding": "angle",
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
          "customer_type",
        ],
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
            "field": "customer_type",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "dataset": [
          {
            "id-1": 5152793.296000013,
            "id-2": "公司",
          },
          {
            "id-1": 2891088.6410000017,
            "id-2": "小型企业",
          },
          {
            "id-1": 8025072.187999996,
            "id-2": "消费者",
          },
        ],
        "dimensions": [
          {
            "alias": "客户类型",
            "encoding": "color",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "angle",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('line-by-province', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('area')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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
            "field": "province",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": "云南",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": "吉林",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 58121,
            "id-2": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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

  it('line-chart', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('area')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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
            "field": "province",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "area",
        "dataset": [
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 360925.76800000016,
            "id-2": "云南",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 640196.5709999998,
            "id-2": "吉林",
          },
          {
            "id-1": 400877.5960000003,
            "id-2": "四川",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 58121,
            "id-2": "宁夏",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 1586782.9879999978,
            "id-2": "山东",
          },
        ],
        "dimensions": [
          {
            "alias": "省份",
            "encoding": "xAxis",
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

  it('pie-by-area', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('donut')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "donut",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "区域",
            "encoding": "color",
            "field": "area",
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
            "encoding": "angle",
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
        "chartType": "donut",
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
            "encoding": "color",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "angle",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('pie-chart-measure-encoding', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'pie',
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
          encoding: 'angle',
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
      builder.chartType.changeChartType('pie')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "color",
            "field": "product_type",
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
            "encoding": "angle",
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
          "product_type",
        ],
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
            "field": "product_type",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "dataset": [
          {
            "id-1": 4865589.791999991,
            "id-2": "办公用品",
          },
          {
            "id-1": 5734340.829,
            "id-2": "家具",
          },
          {
            "id-1": 5469023.503999994,
            "id-2": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "产品类型",
            "encoding": "color",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "angle",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('rose-by-city', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('pie')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "城市",
            "encoding": "color",
            "field": "city",
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
            "encoding": "angle",
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
          "city",
        ],
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
            "field": "city",
          },
        ],
      }
    `)

    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "pie",
        "dataset": [
          {
            "id-1": 52827.32000000001,
            "id-2": "七台河",
          },
          {
            "id-1": 16921.576,
            "id-2": "万县",
          },
          {
            "id-1": 22698.396,
            "id-2": "三亚",
          },
          {
            "id-1": 3262.9799999999996,
            "id-2": "三岔子",
          },
          {
            "id-1": 1458.8,
            "id-2": "三明",
          },
          {
            "id-1": 11704.476,
            "id-2": "上梅",
          },
          {
            "id-1": 582450.5679999999,
            "id-2": "上海",
          },
          {
            "id-1": 10672.872000000001,
            "id-2": "上虞",
          },
          {
            "id-1": 1785.84,
            "id-2": "东丰",
          },
          {
            "id-1": 2789.8920000000003,
            "id-2": "东台",
          },
        ],
        "dimensions": [
          {
            "alias": "城市",
            "encoding": "color",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "angle",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('scatter-chart-measure-encoding', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'scatter',
      dimensions: [],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'xAxis',
        },
        {
          field: 'profit',
          alias: '利润',
          encoding: 'yAxis',
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
      builder.chartType.changeChartType('scatter')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "scatter",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilter": {
          "conditions": [],
          "id": "root",
          "op": "and",
        },
        "limit": 10,
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "xAxis",
            "field": "sales",
            "id": "id-1",
          },
          {
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
        "groupBy": [],
        "limit": 10,
        "select": [
          {
            "aggr": undefined,
            "alias": "id-1",
            "field": "sales",
          },
          {
            "aggr": undefined,
            "alias": "id-2",
            "field": "profit",
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
            "id-1": 129.696,
            "id-2": -60.704,
          },
          {
            "id-1": 125.44,
            "id-2": 42.56,
          },
          {
            "id-1": 31.92,
            "id-2": 4.2,
          },
          {
            "id-1": 321.216,
            "id-2": -27.104,
          },
          {
            "id-1": 1375.92,
            "id-2": 550.2,
          },
          {
            "id-1": 11129.58,
            "id-2": 3783.78,
          },
          {
            "id-1": 479.92,
            "id-2": 172.76,
          },
          {
            "id-1": 8659.84,
            "id-2": 2684.08,
          },
          {
            "id-1": 588,
            "id-2": 46.9,
          },
          {
            "id-1": 154.28,
            "id-2": 33.88,
          },
        ],
        "dimensions": [],
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
        ],
        "theme": "light",
      }
    `)
  })

  it('scatter-sales-profit', async () => {
    const builder = VBI.createChart({
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
      builder.chartType.changeChartType('bar')
    }
    applyBuilder(builder)

    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [],
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
            "encoding": "xAxis",
            "field": "sales",
            "id": "id-1",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "xAxis",
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
        "groupBy": [],
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "profit",
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
            "id-1": 16068954.12500003,
            "id-2": 2147538.9250000017,
          },
        ],
        "dimensions": [],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "xAxis",
            "id": "id-1",
          },
          {
            "alias": "利润",
            "encoding": "xAxis",
            "id": "id-2",
          },
        ],
        "theme": "light",
      }
    `)
  })
})
