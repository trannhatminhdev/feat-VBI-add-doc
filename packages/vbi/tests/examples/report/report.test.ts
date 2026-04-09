import { rs } from '@rstest/core'
import { createVBI, type VBIReportBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('Report', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('basic-page', async () => {
    const LocalVBI = createVBI()
    const resources = {
      charts: {
        salesChart: LocalVBI.createChart({
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
        }),
      },
      insights: {
        salesInsight: LocalVBI.createInsight({
          content: '销售额集中在华东区域，上海与浙江贡献最高。',
          version: 0,
        }),
      },
    }
    const builder = LocalVBI.createReport({
      pages: [],
      version: 0,
    })

    const applyBuilder = (builder: VBIReportBuilder, resources: any) => {
      builder.page.add('销售概览', (page) => {
        page.setChartId(resources.charts.salesChart)
        page.setInsightId(resources.insights.salesInsight)
      })
    }
    applyBuilder(builder, resources)

    const reportDSL = builder.build()
    expect(reportDSL).toMatchInlineSnapshot(`
      {
        "pages": [
          {
            "chartId": "uuid-1",
            "id": "id-3",
            "insightId": "uuid-2",
            "title": "销售概览",
          },
        ],
        "uuid": "uuid-3",
        "version": 0,
      }
    `)

    const snapshotDSL = builder.snapshot()
    expect(snapshotDSL).toMatchInlineSnapshot(`
      {
        "charts": {
          "uuid-1": {
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
          },
        },
        "insights": {
          "uuid-2": {
            "content": "销售额集中在华东区域，上海与浙江贡献最高。",
            "uuid": "uuid-2",
            "version": 0,
          },
        },
        "report": {
          "pages": [
            {
              "chartId": "uuid-1",
              "id": "id-3",
              "insightId": "uuid-2",
              "title": "销售概览",
            },
          ],
          "uuid": "uuid-3",
          "version": 0,
        },
      }
    `)
  })
})
