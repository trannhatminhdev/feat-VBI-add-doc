import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('WhereFilter', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('office-supplies-sales-by-province', async () => {
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilter.add('product_type', (node) => {
        node.setOperator('eq').setValue('办公用品')
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
            "encoding": "xAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "product_type",
              "id": "id-3",
              "op": "eq",
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
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "product_type",
              "op": "eq",
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
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 145678.31599999996,
            "id-2": "浙江",
          },
          {
            "id-1": 114141.496,
            "id-2": "四川",
          },
          {
            "id-1": 237378.876,
            "id-2": "江苏",
          },
          {
            "id-1": 408478.70000000024,
            "id-2": "广东",
          },
          {
            "id-1": 45201.52,
            "id-2": "江西",
          },
          {
            "id-1": 490581.2800000006,
            "id-2": "山东",
          },
          {
            "id-1": 197696.65999999997,
            "id-2": "上海",
          },
          {
            "id-1": 225399.8599999999,
            "id-2": "河北",
          },
          {
            "id-1": 100060.37999999998,
            "id-2": "福建",
          },
          {
            "id-1": 192031.5600000002,
            "id-2": "安徽",
          },
          {
            "id-1": 42723.77200000001,
            "id-2": "甘肃",
          },
          {
            "id-1": 397944.37199999974,
            "id-2": "黑龙江",
          },
          {
            "id-1": 119124.93600000005,
            "id-2": "吉林",
          },
          {
            "id-1": 307603.7439999999,
            "id-2": "辽宁",
          },
          {
            "id-1": 129221.68000000004,
            "id-2": "陕西",
          },
          {
            "id-1": 220619.22400000007,
            "id-2": "湖北",
          },
          {
            "id-1": 250176.724,
            "id-2": "湖南",
          },
          {
            "id-1": 146253.80000000002,
            "id-2": "北京",
          },
          {
            "id-1": 79668.54000000002,
            "id-2": "重庆",
          },
          {
            "id-1": 16289.980000000001,
            "id-2": "青海",
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
            "encoding": "xAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('high-discount-tech-profit-analysis', async () => {
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
      builder.whereFilter
        .add('product_type', (node) => node.setOperator('eq').setValue('技术'))
        .add('discount', (node) => node.setOperator('>').setValue(0.5))
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
            "alias": "区域",
            "field": "area",
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
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "product_type",
              "id": "id-3",
              "op": "eq",
              "value": "技术",
            },
            {
              "field": "discount",
              "id": "id-4",
              "op": ">",
              "value": 0.5,
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
          "area",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "profit",
          },
          {
            "alias": "id-2",
            "field": "area",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "product_type",
              "op": "eq",
              "value": "技术",
            },
            {
              "field": "discount",
              "op": ">",
              "value": 0.5,
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
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('or-group-product-category-comparison', async () => {
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
      builder.whereFilter.addGroup('or', (group) => {
        group
          .add('product_type', (node) => node.setOperator('eq').setValue('办公用品'))
          .add('product_type', (node) => node.setOperator('eq').setValue('技术'))
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
            "alias": "区域",
            "field": "area",
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
          "conditions": [
            {
              "conditions": [
                {
                  "field": "product_type",
                  "id": "id-4",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "id": "id-5",
                  "op": "eq",
                  "value": "技术",
                },
              ],
              "id": "id-3",
              "op": "or",
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
          "area",
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
        ],
        "where": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "技术",
                },
              ],
              "op": "or",
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
            "id-1": 3008282.3119999967,
            "id-2": "华东",
          },
          {
            "id-1": 801590.7760000004,
            "id-2": "西南",
          },
          {
            "id-1": 2737486.891999999,
            "id-2": "中南",
          },
          {
            "id-1": 498827.1680000002,
            "id-2": "西北",
          },
          {
            "id-1": 1760869.0679999974,
            "id-2": "东北",
          },
          {
            "id-1": 1527557.0800000005,
            "id-2": "华北",
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

  it('between-sales-range-analysis', async () => {
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
      builder.whereFilter.add('sales', (node) => {
        node.setOperator('between').setValue({ min: 1000, max: 10000 })
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
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "sales",
              "id": "id-3",
              "op": "between",
              "value": {
                "max": 10000,
                "min": 1000,
              },
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
          "product_type",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "profit",
          },
          {
            "alias": "id-2",
            "field": "product_type",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "sales",
              "op": ">=",
              "value": 1000,
            },
            {
              "field": "sales",
              "op": "<=",
              "value": 10000,
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
            "id-1": 409384.16399999964,
            "id-2": "办公用品",
          },
          {
            "id-1": 410495.35099999956,
            "id-2": "家具",
          },
          {
            "id-1": 549756.6759999999,
            "id-2": "技术",
          },
        ],
        "dimensions": [
          {
            "alias": "品类",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('clear-and-rebuild-filters', async () => {
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
        conditions: [
          {
            id: 'f-old1',
            field: 'product_type',
            op: 'eq',
            value: '办公用品',
          },
          {
            id: 'f-old2',
            field: 'area',
            op: 'eq',
            value: '华东',
          },
        ],
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
      builder.whereFilter
        .clear()
        .add('profit', (node) => node.setOperator('>').setValue(0))
        .addGroup('or', (group) => {
          group
            .add('area', (n) => n.setOperator('eq').setValue('华东'))
            .add('area', (n) => n.setOperator('eq').setValue('华北'))
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
            "alias": "利润",
            "encoding": "yAxis",
            "field": "profit",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "profit",
              "id": "id-3",
              "op": ">",
              "value": 0,
            },
            {
              "conditions": [
                {
                  "field": "area",
                  "id": "id-5",
                  "op": "eq",
                  "value": "华东",
                },
                {
                  "field": "area",
                  "id": "id-6",
                  "op": "eq",
                  "value": "华北",
                },
              ],
              "id": "id-4",
              "op": "or",
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
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "profit",
          },
          {
            "alias": "id-2",
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "profit",
              "op": ">",
              "value": 0,
            },
            {
              "conditions": [
                {
                  "field": "area",
                  "op": "eq",
                  "value": "华东",
                },
                {
                  "field": "area",
                  "op": "eq",
                  "value": "华北",
                },
              ],
              "op": "or",
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
            "id-1": 52322.312000000005,
            "id-2": "江西",
          },
          {
            "id-1": 396090.1,
            "id-2": "山东",
          },
          {
            "id-1": 40476.07199999999,
            "id-2": "江苏",
          },
          {
            "id-1": 125734.168,
            "id-2": "上海",
          },
          {
            "id-1": 17063.116,
            "id-2": "浙江",
          },
          {
            "id-1": 175924.6300000001,
            "id-2": "河北",
          },
          {
            "id-1": 142959.65600000002,
            "id-2": "福建",
          },
          {
            "id-1": 150820.95700000008,
            "id-2": "安徽",
          },
          {
            "id-1": 91961.94000000003,
            "id-2": "北京",
          },
          {
            "id-1": 122949.43499999997,
            "id-2": "天津",
          },
          {
            "id-1": 107063.39000000009,
            "id-2": "山西",
          },
          {
            "id-1": 14150.891999999996,
            "id-2": "内蒙古",
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
            "alias": "利润",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('update-filter-switch-province', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
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
          encoding: 'xAxis',
          aggregate: {
            func: 'sum',
          },
        },
      ],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'f-province',
            field: 'province',
            op: 'eq',
            value: '浙江',
          },
          {
            id: 'f-product',
            field: 'product_type',
            op: 'eq',
            value: '技术',
          },
        ],
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
      builder.whereFilter.update('f-province', (node) => {
        node.setValue('广东')
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
            "alias": "城市",
            "field": "city",
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
            "encoding": "xAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "province",
              "id": "f-province",
              "op": "eq",
              "value": "广东",
            },
            {
              "field": "product_type",
              "id": "f-product",
              "op": "eq",
              "value": "技术",
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
          "city",
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
            "field": "city",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "province",
              "op": "eq",
              "value": "广东",
            },
            {
              "field": "product_type",
              "op": "eq",
              "value": "技术",
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
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 11219.74,
            "id-2": "阳江",
          },
          {
            "id-1": 17325.420000000002,
            "id-2": "湛江",
          },
          {
            "id-1": 13270.88,
            "id-2": "廉洲",
          },
          {
            "id-1": 2832.0600000000004,
            "id-2": "河源",
          },
          {
            "id-1": 26207.44,
            "id-2": "汕头",
          },
          {
            "id-1": 104206.34000000001,
            "id-2": "深圳",
          },
          {
            "id-1": 1448.58,
            "id-2": "荔城",
          },
          {
            "id-1": 25275.879999999997,
            "id-2": "洛阳",
          },
          {
            "id-1": 11398.380000000001,
            "id-2": "江门",
          },
          {
            "id-1": 1711.5,
            "id-2": "河坡",
          },
          {
            "id-1": 10807.58,
            "id-2": "肇庆",
          },
          {
            "id-1": 4257.54,
            "id-2": "汕尾",
          },
          {
            "id-1": 9671.2,
            "id-2": "韶关",
          },
          {
            "id-1": 6747.4400000000005,
            "id-2": "清远",
          },
          {
            "id-1": 100316.01999999997,
            "id-2": "广州",
          },
          {
            "id-1": 18667.739999999998,
            "id-2": "揭阳",
          },
          {
            "id-1": 12069.400000000001,
            "id-2": "珠海",
          },
          {
            "id-1": 8171.94,
            "id-2": "惠城",
          },
          {
            "id-1": 2360.4,
            "id-2": "廉江",
          },
          {
            "id-1": 7060.619999999999,
            "id-2": "吴川",
          },
        ],
        "dimensions": [
          {
            "alias": "城市",
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

  it('nested-group-region-product-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
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
      builder.whereFilter
        .add('area', (node) => node.setOperator('eq').setValue('华东'))
        .addGroup('or', (group) => {
          group
            .add('product_type', (node) => node.setOperator('eq').setValue('办公用品'))
            .add('product_type', (node) => node.setOperator('eq').setValue('家具'))
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
            "alias": "城市",
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
            "encoding": "yAxis",
            "field": "sales",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "area",
              "id": "id-3",
              "op": "eq",
              "value": "华东",
            },
            {
              "conditions": [
                {
                  "field": "product_type",
                  "id": "id-5",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "id": "id-6",
                  "op": "eq",
                  "value": "家具",
                },
              ],
              "id": "id-4",
              "op": "or",
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
          "city",
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
            "field": "city",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "area",
              "op": "eq",
              "value": "华东",
            },
            {
              "conditions": [
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "家具",
                },
              ],
              "op": "or",
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
            "id-1": 49029.147999999994,
            "id-2": "杭州",
          },
          {
            "id-1": 7226.352,
            "id-2": "镇江",
          },
          {
            "id-1": 55837.32000000001,
            "id-2": "景德镇",
          },
          {
            "id-1": 129432.32400000002,
            "id-2": "青岛",
          },
          {
            "id-1": 67918.70400000004,
            "id-2": "徐州",
          },
          {
            "id-1": 378368.788,
            "id-2": "上海",
          },
          {
            "id-1": 7999.319999999999,
            "id-2": "温岭",
          },
          {
            "id-1": 21162.651999999995,
            "id-2": "宁波",
          },
          {
            "id-1": 96425.64400000001,
            "id-2": "厦门",
          },
          {
            "id-1": 95618.35499999998,
            "id-2": "宿州",
          },
        ],
        "dimensions": [
          {
            "alias": "城市",
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

  it('deeply-nested-or-and-groups', async () => {
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
      builder.whereFilter
        .add('sales', (node) => node.setOperator('>').setValue(500))
        .addGroup('or', (outerGroup) => {
          outerGroup
            .addGroup('and', (g1) => {
              g1.add('customer_type', (n) => n.setOperator('eq').setValue('消费者')).add('delivery_method', (n) =>
                n.setOperator('eq').setValue('当日'),
              )
            })
            .addGroup('and', (g2) => {
              g2.add('customer_type', (n) => n.setOperator('in').setValue(['公司', '小型企业'])).add(
                'delivery_method',
                (n) => n.setOperator('eq').setValue('一级'),
              )
            })
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
          "conditions": [
            {
              "field": "sales",
              "id": "id-3",
              "op": ">",
              "value": 500,
            },
            {
              "conditions": [
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "id": "id-6",
                      "op": "eq",
                      "value": "消费者",
                    },
                    {
                      "field": "delivery_method",
                      "id": "id-7",
                      "op": "eq",
                      "value": "当日",
                    },
                  ],
                  "id": "id-5",
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "id": "id-9",
                      "op": "in",
                      "value": [
                        "公司",
                        "小型企业",
                      ],
                    },
                    {
                      "field": "delivery_method",
                      "id": "id-10",
                      "op": "eq",
                      "value": "一级",
                    },
                  ],
                  "id": "id-8",
                  "op": "and",
                },
              ],
              "id": "id-4",
              "op": "or",
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
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "sales",
              "op": ">",
              "value": 500,
            },
            {
              "conditions": [
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "op": "eq",
                      "value": "消费者",
                    },
                    {
                      "field": "delivery_method",
                      "op": "eq",
                      "value": "当日",
                    },
                  ],
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "op": "in",
                      "value": [
                        "公司",
                        "小型企业",
                      ],
                    },
                    {
                      "field": "delivery_method",
                      "op": "eq",
                      "value": "一级",
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
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [
          {
            "id-1": 79728.01200000002,
            "id-2": "江苏",
          },
          {
            "id-1": 15967,
            "id-2": "北京",
          },
          {
            "id-1": 17851.54,
            "id-2": "陕西",
          },
          {
            "id-1": 26947.9,
            "id-2": "四川",
          },
          {
            "id-1": 83344.485,
            "id-2": "黑龙江",
          },
          {
            "id-1": 124768.41999999997,
            "id-2": "山东",
          },
          {
            "id-1": 65781.12800000001,
            "id-2": "湖南",
          },
          {
            "id-1": 77988.17599999999,
            "id-2": "辽宁",
          },
          {
            "id-1": 60887.26000000002,
            "id-2": "重庆",
          },
          {
            "id-1": 3116.568,
            "id-2": "甘肃",
          },
          {
            "id-1": 51542.79199999999,
            "id-2": "浙江",
          },
          {
            "id-1": 35174.3,
            "id-2": "江西",
          },
          {
            "id-1": 93302.09000000001,
            "id-2": "河南",
          },
          {
            "id-1": 30692.2,
            "id-2": "天津",
          },
          {
            "id-1": 21173.278,
            "id-2": "广西",
          },
          {
            "id-1": 53771.28400000001,
            "id-2": "湖北",
          },
          {
            "id-1": 104612.34,
            "id-2": "福建",
          },
          {
            "id-1": 27309.100000000002,
            "id-2": "上海",
          },
          {
            "id-1": 167463.604,
            "id-2": "广东",
          },
          {
            "id-1": 47204.668000000005,
            "id-2": "内蒙古",
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

  it('remove-condition-from-group', async () => {
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
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'g-products',
            op: 'or',
            conditions: [
              {
                id: 'f-office',
                field: 'product_type',
                op: 'eq',
                value: '办公用品',
              },
              {
                id: 'f-tech',
                field: 'product_type',
                op: 'eq',
                value: '技术',
              },
              {
                id: 'f-furniture',
                field: 'product_type',
                op: 'eq',
                value: '家具',
              },
            ],
          },
        ],
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
      builder.whereFilter.updateGroup('g-products', (group) => {
        group.remove('f-furniture')
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
            "alias": "区域",
            "field": "area",
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
          "conditions": [
            {
              "conditions": [
                {
                  "field": "product_type",
                  "id": "f-office",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "id": "f-tech",
                  "op": "eq",
                  "value": "技术",
                },
              ],
              "id": "g-products",
              "op": "or",
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
          "area",
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
        ],
        "where": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "op": "eq",
                  "value": "技术",
                },
              ],
              "op": "or",
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
            "id-1": 3008282.3119999967,
            "id-2": "华东",
          },
          {
            "id-1": 801590.7760000004,
            "id-2": "西南",
          },
          {
            "id-1": 2737486.891999999,
            "id-2": "中南",
          },
          {
            "id-1": 498827.1680000002,
            "id-2": "西北",
          },
          {
            "id-1": 1760869.0679999974,
            "id-2": "东北",
          },
          {
            "id-1": 1527557.0800000005,
            "id-2": "华北",
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

  it('in-operator-multi-area-delivery', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'delivery_method',
          alias: '配送方式',
        },
      ],
      measures: [
        {
          field: 'amount',
          alias: '订单量',
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilter.add('area', (node) => {
        node.setOperator('in').setValue(['华东', '华北', '中南'])
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
            "alias": "配送方式",
            "field": "delivery_method",
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
            "alias": "订单量",
            "encoding": "xAxis",
            "field": "amount",
            "id": "id-1",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "area",
              "id": "id-3",
              "op": "in",
              "value": [
                "华东",
                "华北",
                "中南",
              ],
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
          "delivery_method",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "amount",
          },
          {
            "alias": "id-2",
            "field": "delivery_method",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "area",
              "op": "in",
              "value": [
                "华东",
                "华北",
                "中南",
              ],
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
        "chartType": "bar",
        "dataset": [
          {
            "id-1": 5425,
            "id-2": "二级",
          },
          {
            "id-1": 14986,
            "id-2": "标准级",
          },
          {
            "id-1": 4042,
            "id-2": "一级",
          },
          {
            "id-1": 1434,
            "id-2": "当日",
          },
        ],
        "dimensions": [
          {
            "alias": "配送方式",
            "id": "id-2",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "订单量",
            "encoding": "xAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('remove-filter-by-index', async () => {
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
      ],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'f-product',
            field: 'product_type',
            op: 'eq',
            value: '办公用品',
          },
          {
            id: 'f-area',
            field: 'area',
            op: 'in',
            value: ['华东', '华北', '中南'],
          },
        ],
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
      builder.whereFilter.remove(0)
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
          "conditions": [
            {
              "field": "area",
              "id": "f-area",
              "op": "in",
              "value": [
                "华东",
                "华北",
                "中南",
              ],
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
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "area",
              "op": "in",
              "value": [
                "华东",
                "华北",
                "中南",
              ],
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
            "id-1": 452108.2440000001,
            "id-2": "浙江",
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
          {
            "id-1": 546903.5320000001,
            "id-2": "福建",
          },
          {
            "id-1": 628965.1899999997,
            "id-2": "安徽",
          },
          {
            "id-1": 621960.3320000009,
            "id-2": "湖北",
          },
          {
            "id-1": 853574.798999999,
            "id-2": "河南",
          },
          {
            "id-1": 723442.2090000004,
            "id-2": "湖南",
          },
          {
            "id-1": 409147.2,
            "id-2": "北京",
          },
          {
            "id-1": 377653.82899999997,
            "id-2": "广西",
          },
          {
            "id-1": 549906.6300000001,
            "id-2": "天津",
          },
          {
            "id-1": 423878.76999999967,
            "id-2": "山西",
          },
          {
            "id-1": 273453.01199999993,
            "id-2": "内蒙古",
          },
          {
            "id-1": 107854.41100000001,
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

  it('update-group-or-to-and', async () => {
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
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'g-customer',
            op: 'or',
            conditions: [
              {
                id: 'f-ct1',
                field: 'customer_type',
                op: 'eq',
                value: '公司',
              },
              {
                id: 'f-ct2',
                field: 'customer_type',
                op: 'eq',
                value: '消费者',
              },
            ],
          },
        ],
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
      builder.whereFilter.updateGroup('g-customer', (group) => {
        group.setOperator('and')
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
            "alias": "区域",
            "field": "area",
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
          "conditions": [
            {
              "conditions": [
                {
                  "field": "customer_type",
                  "id": "f-ct1",
                  "op": "eq",
                  "value": "公司",
                },
                {
                  "field": "customer_type",
                  "id": "f-ct2",
                  "op": "eq",
                  "value": "消费者",
                },
              ],
              "id": "g-customer",
              "op": "and",
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
          "area",
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
        ],
        "where": {
          "conditions": [
            {
              "conditions": [
                {
                  "field": "customer_type",
                  "op": "eq",
                  "value": "公司",
                },
                {
                  "field": "customer_type",
                  "op": "eq",
                  "value": "消费者",
                },
              ],
              "op": "and",
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
})
