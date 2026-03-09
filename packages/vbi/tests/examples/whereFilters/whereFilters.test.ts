import { VBI } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('WhereFilters', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('bar-by-province-with-filter', async () => {
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
      filters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.add({ field: 'sales', operator: 'gt', value: 100000 })
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
        "havingFilters": [],
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
        "whereFilters": [
          {
            "field": "sales",
            "operator": "gt",
            "value": 100000,
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "province",
        ],
        "limit": 1000,
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
              "op": "gt",
              "value": 100000,
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
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('column-by-area-multiple-filters', async () => {
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
      filters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters
        .add({ field: 'sales', operator: 'gt', value: 500000 })
        .add({ field: 'area', operator: 'in', value: ['华东', '华北'] })
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
        "havingFilters": [],
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
        "whereFilters": [
          {
            "field": "sales",
            "operator": "gt",
            "value": 500000,
          },
          {
            "field": "area",
            "operator": "in",
            "value": [
              "华东",
              "华北",
            ],
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "limit": 1000,
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
              "field": "sales",
              "op": "gt",
              "value": 500000,
            },
            {
              "field": "area",
              "op": "in",
              "value": [
                "华东",
                "华北",
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
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
