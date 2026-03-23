import { VBI, VBIChartBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Measures', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('add-measure-encoding', async () => {
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
      builder.measures.add('sales', (n) => n.setAlias('销售额'))
      const measureId = builder.measures.find((node) => node.getField() === 'sales')?.getId()
      if (measureId) {
        builder.measures.update(measureId, (n) => n.setEncoding('yAxis').setAggregate({ func: 'sum' }))
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
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
        "groupBy": [],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "sales",
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
            "id-1": 16068954.12500003,
          },
        ],
        "dimensions": [],
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

  it('add-measure', async () => {
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
      builder.measures.add('sales', (node) => {
        node.setAlias('原销售额')
      })
      const measureId = builder.measures.find((node) => node.getField() === 'sales')?.getId()
      if (measureId) {
        builder.measures.update(measureId, (node) => {
          node.setAlias('销售额').setAggregate({ func: 'sum' })
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
        "dimensions": [],
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
            "encoding": "column",
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
        "groupBy": [],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-1",
            "field": "sales",
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
            "id-1": 16068954.12500003,
          },
        ],
        "dimensions": [],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额",
            "encoding": "column",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('measure-with-custom-and-auto-format', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [
        {
          field: 'product_type',
          alias: '品类',
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
      builder.measures
        .add('sales', (node) => {
          node.setAlias('销售额（万元）').setAggregate({ func: 'sum' }).setEncoding('column').setFormat({
            type: 'number',
            ratio: 10000,
            symbol: '万',
            prefix: '¥',
            fractionDigits: 2,
          })
        })
        .add('profit', (node) => {
          node.setAlias('利润').setAggregate({ func: 'sum' }).setEncoding('column').setFormat({ autoFormat: true })
        })
        .add('discount', (node) => {
          node.setAlias('平均折扣').setAggregate({ func: 'avg' }).setEncoding('column').setFormat({
            type: 'percent',
            fractionDigits: 1,
          })
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
            "alias": "品类",
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
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "销售额（万元）",
            "encoding": "column",
            "field": "sales",
            "format": {
              "fractionDigits": 2,
              "prefix": "¥",
              "ratio": 10000,
              "symbol": "万",
              "type": "number",
            },
            "id": "id-2",
          },
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "利润",
            "encoding": "column",
            "field": "profit",
            "format": {
              "autoFormat": true,
            },
            "id": "id-3",
          },
          {
            "aggregate": {
              "func": "avg",
            },
            "alias": "平均折扣",
            "encoding": "column",
            "field": "discount",
            "format": {
              "fractionDigits": 1,
              "type": "percent",
            },
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
            "aggr": {
              "func": "sum",
            },
            "alias": "id-2",
            "field": "sales",
          },
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "id-3",
            "field": "profit",
          },
          {
            "aggr": {
              "func": "avg",
            },
            "alias": "id-4",
            "field": "discount",
          },
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
            "id-2": 4865589.791999991,
            "id-3": 757640.3519999951,
            "id-4": 0.08510638297872211,
          },
          {
            "id-1": "家具",
            "id-2": 5734340.829,
            "id-3": 638735.6290000005,
            "id-4": 0.1448752228163989,
          },
          {
            "id-1": "技术",
            "id-2": 5469023.503999994,
            "id-3": 751162.9440000018,
            "id-4": 0.123570019723867,
          },
        ],
        "dimensions": [
          {
            "alias": "品类",
            "id": "id-1",
          },
        ],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "销售额（万元）",
            "autoFormat": false,
            "encoding": "column",
            "id": "id-2",
            "numFormat": {
              "fractionDigits": 2,
              "prefix": "¥",
              "ratio": 10000,
              "symbol": "万",
              "type": "number",
            },
          },
          {
            "alias": "利润",
            "autoFormat": true,
            "encoding": "column",
            "id": "id-3",
          },
          {
            "alias": "平均折扣",
            "autoFormat": false,
            "encoding": "column",
            "id": "id-4",
            "numFormat": {
              "fractionDigits": 1,
              "type": "percent",
            },
          },
        ],
        "theme": "light",
      }
    `)
  })

  it('remove-measure', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          aggregate: {
            func: 'sum',
          },
          encoding: 'yAxis',
        },
        {
          field: 'profit',
          alias: '利润',
          aggregate: {
            func: 'sum',
          },
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const measureId = builder.measures.toJSON().find((item) => item.field === 'sales')?.id
      if (measureId) {
        builder.measures.update(measureId, (n) => n.setAlias('待移除的销售额'))
        builder.measures.remove(measureId)
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
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
        "groupBy": [],
        "limit": 20,
        "select": [
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

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [
          {
            "id-2": 2147538.9250000017,
          },
        ],
        "dimensions": [],
        "locale": "zh-CN",
        "measures": [
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

  it('update-measure', async () => {
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [
        {
          field: 'sales',
          alias: '原销售额',
          aggregate: {
            func: 'sum',
          },
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
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIChartBuilder) => {
      const measureId = builder.measures.toJSON().find((item) => item.field === 'sales')?.id
      if (measureId) {
        const measure = builder.measures.find((node) => node.getId() === measureId)
        if (measure) {
          measure.setAlias('待调整销售额').setEncoding('yAxis')
        }
        builder.measures.update(measureId, (n) => n.setAlias('新销售额').setAggregate({ func: 'avg' }))
      }
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
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
              "func": "avg",
            },
            "alias": "新销售额",
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
        "groupBy": [],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "avg",
            },
            "alias": "id-1",
            "field": "sales",
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
            "id-1": 1613.5108068079155,
          },
        ],
        "dimensions": [],
        "locale": "zh-CN",
        "measures": [
          {
            "alias": "新销售额",
            "encoding": "yAxis",
            "id": "id-1",
          },
        ],
        "theme": "light",
      }
    `)
  })
})
