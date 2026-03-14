import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('WhereFilters', () => {
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "product_type",
              "id": "id-1",
              "op": "eq",
              "value": "办公用品",
            },
          ],
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
            "alias": "销售额",
            "field": "sales",
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
            "省份": "浙江",
            "销售额": 145678.31599999996,
          },
          {
            "省份": "四川",
            "销售额": 114141.496,
          },
          {
            "省份": "江苏",
            "销售额": 237378.876,
          },
          {
            "省份": "广东",
            "销售额": 408478.70000000024,
          },
          {
            "省份": "江西",
            "销售额": 45201.52,
          },
          {
            "省份": "山东",
            "销售额": 490581.2800000006,
          },
          {
            "省份": "上海",
            "销售额": 197696.65999999997,
          },
          {
            "省份": "河北",
            "销售额": 225399.8599999999,
          },
          {
            "省份": "福建",
            "销售额": 100060.37999999998,
          },
          {
            "省份": "安徽",
            "销售额": 192031.5600000002,
          },
          {
            "省份": "甘肃",
            "销售额": 42723.77200000001,
          },
          {
            "省份": "黑龙江",
            "销售额": 397944.37199999974,
          },
          {
            "省份": "吉林",
            "销售额": 119124.93600000005,
          },
          {
            "省份": "辽宁",
            "销售额": 307603.7439999999,
          },
          {
            "省份": "陕西",
            "销售额": 129221.68000000004,
          },
          {
            "省份": "湖北",
            "销售额": 220619.22400000007,
          },
          {
            "省份": "湖南",
            "销售额": 250176.724,
          },
          {
            "省份": "北京",
            "销售额": 146253.80000000002,
          },
          {
            "省份": "重庆",
            "销售额": 79668.54000000002,
          },
          {
            "省份": "青海",
            "销售额": 16289.980000000001,
          },
        ],
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "product_type",
              "id": "id-1",
              "op": "eq",
              "value": "技术",
            },
            {
              "field": "discount",
              "id": "id-2",
              "op": ">",
              "value": 0.5,
            },
          ],
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
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "区域",
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
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
                  "id": "id-2",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "id": "id-3",
                  "op": "eq",
                  "value": "技术",
                },
              ],
              "id": "id-1",
              "op": "or",
            },
          ],
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
            "alias": "区域",
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
            "区域": "华东",
            "销售额": 3008282.3119999967,
          },
          {
            "区域": "西南",
            "销售额": 801590.7760000004,
          },
          {
            "区域": "中南",
            "销售额": 2737486.891999999,
          },
          {
            "区域": "西北",
            "销售额": 498827.1680000002,
          },
          {
            "区域": "东北",
            "销售额": 1760869.0679999974,
          },
          {
            "区域": "华北",
            "销售额": 1527557.0800000005,
          },
        ],
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "sales",
              "id": "id-1",
              "op": "between",
              "value": {
                "max": 10000,
                "min": 1000,
              },
            },
          ],
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
            "alias": "利润",
            "field": "profit",
          },
          {
            "alias": "品类",
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
            "利润": 409384.16399999964,
            "品类": "办公用品",
          },
          {
            "利润": 410495.35099999956,
            "品类": "家具",
          },
          {
            "利润": 549756.6759999999,
            "品类": "技术",
          },
        ],
        "locale": "zh-CN",
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "profit",
              "id": "id-1",
              "op": ">",
              "value": 0,
            },
            {
              "conditions": [
                {
                  "field": "area",
                  "id": "id-3",
                  "op": "eq",
                  "value": "华东",
                },
                {
                  "field": "area",
                  "id": "id-4",
                  "op": "eq",
                  "value": "华北",
                },
              ],
              "id": "id-2",
              "op": "or",
            },
          ],
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
            "利润": 52322.312000000005,
            "省份": "江西",
          },
          {
            "利润": 396090.1,
            "省份": "山东",
          },
          {
            "利润": 40476.07199999999,
            "省份": "江苏",
          },
          {
            "利润": 125734.168,
            "省份": "上海",
          },
          {
            "利润": 17063.116,
            "省份": "浙江",
          },
          {
            "利润": 175924.6300000001,
            "省份": "河北",
          },
          {
            "利润": 142959.65600000002,
            "省份": "福建",
          },
          {
            "利润": 150820.95700000008,
            "省份": "安徽",
          },
          {
            "利润": 91961.94000000003,
            "省份": "北京",
          },
          {
            "利润": 122949.43499999997,
            "省份": "天津",
          },
          {
            "利润": 107063.39000000009,
            "省份": "山西",
          },
          {
            "利润": 14150.891999999996,
            "省份": "内蒙古",
          },
        ],
        "locale": "zh-CN",
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "城市",
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
            "城市": "阳江",
            "销售额": 11219.74,
          },
          {
            "城市": "湛江",
            "销售额": 17325.420000000002,
          },
          {
            "城市": "廉洲",
            "销售额": 13270.88,
          },
          {
            "城市": "河源",
            "销售额": 2832.0600000000004,
          },
          {
            "城市": "汕头",
            "销售额": 26207.44,
          },
          {
            "城市": "深圳",
            "销售额": 104206.34000000001,
          },
          {
            "城市": "荔城",
            "销售额": 1448.58,
          },
          {
            "城市": "洛阳",
            "销售额": 25275.879999999997,
          },
          {
            "城市": "江门",
            "销售额": 11398.380000000001,
          },
          {
            "城市": "河坡",
            "销售额": 1711.5,
          },
          {
            "城市": "肇庆",
            "销售额": 10807.58,
          },
          {
            "城市": "汕尾",
            "销售额": 4257.54,
          },
          {
            "城市": "韶关",
            "销售额": 9671.2,
          },
          {
            "城市": "清远",
            "销售额": 6747.4400000000005,
          },
          {
            "城市": "广州",
            "销售额": 100316.01999999997,
          },
          {
            "城市": "揭阳",
            "销售额": 18667.739999999998,
          },
          {
            "城市": "珠海",
            "销售额": 12069.400000000001,
          },
          {
            "城市": "惠城",
            "销售额": 8171.94,
          },
          {
            "城市": "廉江",
            "销售额": 2360.4,
          },
          {
            "城市": "吴川",
            "销售额": 7060.619999999999,
          },
        ],
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "area",
              "id": "id-1",
              "op": "eq",
              "value": "华东",
            },
            {
              "conditions": [
                {
                  "field": "product_type",
                  "id": "id-3",
                  "op": "eq",
                  "value": "办公用品",
                },
                {
                  "field": "product_type",
                  "id": "id-4",
                  "op": "eq",
                  "value": "家具",
                },
              ],
              "id": "id-2",
              "op": "or",
            },
          ],
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
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "城市",
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
            "城市": "杭州",
            "销售额": 49029.147999999994,
          },
          {
            "城市": "镇江",
            "销售额": 7226.352,
          },
          {
            "城市": "景德镇",
            "销售额": 55837.32000000001,
          },
          {
            "城市": "青岛",
            "销售额": 129432.32400000002,
          },
          {
            "城市": "徐州",
            "销售额": 67918.70400000004,
          },
          {
            "城市": "上海",
            "销售额": 378368.788,
          },
          {
            "城市": "温岭",
            "销售额": 7999.319999999999,
          },
          {
            "城市": "宁波",
            "销售额": 21162.651999999995,
          },
          {
            "城市": "厦门",
            "销售额": 96425.64400000001,
          },
          {
            "城市": "宿州",
            "销售额": 95618.35499999998,
          },
        ],
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "sales",
              "id": "id-1",
              "op": ">",
              "value": 500,
            },
            {
              "conditions": [
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "id": "id-4",
                      "op": "eq",
                      "value": "消费者",
                    },
                    {
                      "field": "delivery_method",
                      "id": "id-5",
                      "op": "eq",
                      "value": "当日",
                    },
                  ],
                  "id": "id-3",
                  "op": "and",
                },
                {
                  "conditions": [
                    {
                      "field": "customer_type",
                      "id": "id-7",
                      "op": "in",
                      "value": [
                        "公司",
                        "小型企业",
                      ],
                    },
                    {
                      "field": "delivery_method",
                      "id": "id-8",
                      "op": "eq",
                      "value": "一级",
                    },
                  ],
                  "id": "id-6",
                  "op": "and",
                },
              ],
              "id": "id-2",
              "op": "or",
            },
          ],
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
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "省份",
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
            "省份": "江苏",
            "销售额": 79728.01200000002,
          },
          {
            "省份": "北京",
            "销售额": 15967,
          },
          {
            "省份": "陕西",
            "销售额": 17851.54,
          },
          {
            "省份": "四川",
            "销售额": 26947.9,
          },
          {
            "省份": "黑龙江",
            "销售额": 83344.485,
          },
          {
            "省份": "山东",
            "销售额": 124768.41999999997,
          },
          {
            "省份": "湖南",
            "销售额": 65781.12800000001,
          },
          {
            "省份": "辽宁",
            "销售额": 77988.17599999999,
          },
          {
            "省份": "重庆",
            "销售额": 60887.26000000002,
          },
          {
            "省份": "甘肃",
            "销售额": 3116.568,
          },
          {
            "省份": "浙江",
            "销售额": 51542.79199999999,
          },
          {
            "省份": "江西",
            "销售额": 35174.3,
          },
          {
            "省份": "河南",
            "销售额": 93302.09000000001,
          },
          {
            "省份": "天津",
            "销售额": 30692.2,
          },
          {
            "省份": "广西",
            "销售额": 21173.278,
          },
          {
            "省份": "湖北",
            "销售额": 53771.28400000001,
          },
          {
            "省份": "福建",
            "销售额": 104612.34,
          },
          {
            "省份": "上海",
            "销售额": 27309.100000000002,
          },
          {
            "省份": "广东",
            "销售额": 167463.604,
          },
          {
            "省份": "内蒙古",
            "销售额": 47204.668000000005,
          },
        ],
        "locale": "zh-CN",
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
            "alias": "区域",
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
            "区域": "华东",
            "销售额": 3008282.3119999967,
          },
          {
            "区域": "西南",
            "销售额": 801590.7760000004,
          },
          {
            "区域": "中南",
            "销售额": 2737486.891999999,
          },
          {
            "区域": "西北",
            "销售额": 498827.1680000002,
          },
          {
            "区域": "东北",
            "销售额": 1760869.0679999974,
          },
          {
            "区域": "华北",
            "销售额": 1527557.0800000005,
          },
        ],
        "locale": "zh-CN",
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
        op: 'and',
        conditions: [],
      },
      havingFilter: {
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilter": {
          "conditions": [
            {
              "field": "area",
              "id": "id-1",
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
            "alias": "订单量",
            "field": "amount",
          },
          {
            "alias": "配送方式",
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
            "订单量": 5425,
            "配送方式": "二级",
          },
          {
            "订单量": 14986,
            "配送方式": "标准级",
          },
          {
            "订单量": 4042,
            "配送方式": "一级",
          },
          {
            "订单量": 1434,
            "配送方式": "当日",
          },
        ],
        "locale": "zh-CN",
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "省份",
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
            "省份": "浙江",
            "销售额": 452108.2440000001,
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
          {
            "省份": "福建",
            "销售额": 546903.5320000001,
          },
          {
            "省份": "安徽",
            "销售额": 628965.1899999997,
          },
          {
            "省份": "湖北",
            "销售额": 621960.3320000009,
          },
          {
            "省份": "河南",
            "销售额": 853574.798999999,
          },
          {
            "省份": "湖南",
            "销售额": 723442.2090000004,
          },
          {
            "省份": "北京",
            "销售额": 409147.2,
          },
          {
            "省份": "广西",
            "销售额": 377653.82899999997,
          },
          {
            "省份": "天津",
            "销售额": 549906.6300000001,
          },
          {
            "省份": "山西",
            "销售额": 423878.76999999967,
          },
          {
            "省份": "内蒙古",
            "销售额": 273453.01199999993,
          },
          {
            "省份": "海南",
            "销售额": 107854.41100000001,
          },
        ],
        "locale": "zh-CN",
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
          },
        ],
        "havingFilter": {
          "conditions": [],
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
            "alias": "区域",
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
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
