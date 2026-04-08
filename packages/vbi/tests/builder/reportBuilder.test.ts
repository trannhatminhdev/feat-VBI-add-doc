import { createVBI, VBI } from '@visactor/vbi'

describe('VBIReportBuilder', () => {
  test('page.add builds report from chart and insight builders', () => {
    const LocalVBI = createVBI()
    const chartBuilder = LocalVBI.createChart(LocalVBI.generateEmptyChartDSL('demo'))
    const insightBuilder = LocalVBI.createInsight(LocalVBI.generateEmptyInsightDSL())

    chartBuilder.measures.add('sales', (node) => {
      node.setAlias('Sales').setAggregate({ func: 'sum' }).setEncoding('yAxis')
    })
    insightBuilder.setContent('hello world')
    const chartUUID = chartBuilder.getUUID()
    const insightUUID = insightBuilder.getUUID()

    const reportBuilder = LocalVBI.createReport(LocalVBI.generateEmptyReportDSL())
    const report = reportBuilder.page
      .add('Story One', (page) => page.setChartId(chartBuilder).setInsightId(insightBuilder))
      .build()

    expect(report).toEqual({
      uuid: reportBuilder.getUUID(),
      pages: [
        {
          id: report.pages[0].id,
          title: 'Story One',
          chartId: chartUUID,
          insightId: insightUUID,
        },
      ],
      version: 0,
    })

    expect(reportBuilder.snapshot()).toEqual({
      report,
      charts: {
        [chartUUID]: {
          uuid: chartUUID,
          connectorId: 'demo',
          chartType: 'table',
          measures: [
            {
              id: 'id-1',
              aggregate: { func: 'sum' },
              alias: 'Sales',
              encoding: 'yAxis',
              field: 'sales',
            },
          ],
          dimensions: [],
          whereFilter: { id: 'root', op: 'and', conditions: [] },
          havingFilter: { id: 'root', op: 'and', conditions: [] },
          theme: 'light',
          locale: 'zh-CN',
          version: 0,
        },
      },
      insights: {
        [insightUUID]: {
          uuid: insightUUID,
          content: 'hello world',
          version: 0,
        },
      },
    })
  })

  test('page.update and page.remove work on existing pages', () => {
    const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL())
    const pageId = reportBuilder.page.add('Story One').build().pages[0].id

    reportBuilder.page.update(pageId, (page) => {
      page.setTitle('Story Two').setChartId('chart-2').setInsightId('insight-2')
    })

    expect(reportBuilder.build().pages[0]).toMatchObject({
      id: pageId,
      title: 'Story Two',
      chartId: 'chart-2',
      insightId: 'insight-2',
    })

    reportBuilder.page.remove(pageId)
    expect(reportBuilder.isEmpty()).toBe(true)
  })

  test('createVBI uses shared registry per instance for snapshot references', () => {
    type CustomQueryDSL = { source: 'factory'; count: number }
    type CustomSeedDSL = { type: 'custom-seed'; queryDSL: CustomQueryDSL }

    const CustomVBI = createVBI<CustomQueryDSL, CustomSeedDSL>({
      adapters: {
        buildVQuery: ({ vbiDSL }) => ({ source: 'factory', count: vbiDSL.measures.length }),
        buildVSeed: async ({ queryDSL }) => ({ type: 'custom-seed', queryDSL }),
      },
    })

    const chartBuilder = CustomVBI.createChart(CustomVBI.generateEmptyChartDSL('demo'))
    const insightBuilder = CustomVBI.createInsight(CustomVBI.generateEmptyInsightDSL())
    const reportBuilder = CustomVBI.createReport(CustomVBI.generateEmptyReportDSL())
    const chartUUID = chartBuilder.getUUID()
    const insightUUID = insightBuilder.getUUID()

    chartBuilder.measures.add('sales', () => {})
    insightBuilder.setContent('factory insight')
    reportBuilder.page.add('Story One', (page) => page.setChartId(chartBuilder).setInsightId(insightBuilder))

    expect(chartBuilder.buildVQuery()).toEqual({
      source: 'factory',
      count: 1,
    })
    expect(reportBuilder.snapshot()).toMatchObject({
      charts: {
        [chartUUID]: {
          uuid: chartUUID,
          measures: [{ field: 'sales' }],
        },
      },
      insights: {
        [insightUUID]: {
          uuid: insightUUID,
          content: 'factory insight',
        },
      },
    })
  })

  test('snapshot throws when a referenced resource is missing from registry', () => {
    const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL())
    reportBuilder.page.add('Story One', (page) => page.setChartId('chart-404').setInsightId('insight-404'))

    expect(() => reportBuilder.snapshot()).toThrow('Missing chart resource "chart-404"')
  })

  test('report builders sync through YJS updates', () => {
    const b1 = VBI.createReport(VBI.generateEmptyReportDSL())
    const b2 = VBI.createReport(VBI.generateEmptyReportDSL())

    b2.applyUpdate(b1.encodeStateAsUpdate())
    b1.applyUpdate(b2.encodeStateAsUpdate())

    b1.page.add('Story One', (page) => page.setChartId('chart-1').setInsightId('insight-1'))
    b2.applyUpdate(b1.encodeStateAsUpdate())

    expect(b2.build()).toEqual(b1.build())
  })

  test('report builder generates stable UUID on creation', () => {
    const builder = VBI.createReport(VBI.generateEmptyReportDSL())

    expect(builder.getUUID()).toBe(builder.getUUID())
    expect(typeof builder.getUUID()).toBe('string')
  })
})
