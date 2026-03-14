import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('UndoManager', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('undo-redo', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
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
      // 添加一个新度量 profit
      builder.measures.add('profit', (node) => {
        node.setAlias('利润').setEncoding('yAxis')
      })

      // 撤销添加操作
      builder.undoManager.undo()

      // 重做操作
      builder.undoManager.redo()
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [],
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
          "conditions": [],
          "op": "and",
        },
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
