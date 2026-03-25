import { createVBI, VBI } from '@visactor/vbi'

describe('VBIReportBuilder', () => {
  test('page.add builds report from chart builder and text', () => {
    const chartBuilder = VBI.createChart(VBI.generateEmptyChartDSL('demo'))
    chartBuilder.measures.add('sales', (node) => {
      node.setAlias('Sales').setAggregate({ func: 'sum' }).setEncoding('yAxis')
    })

    const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL())
    const report = reportBuilder.page
      .add('Story One', (page) => page.setChart(chartBuilder).setText('hello world'))
      .build()

    expect(report).toEqual({
      pages: [
        {
          id: 'id-2',
          title: 'Story One',
          chart: {
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
          text: { content: 'hello world' },
        },
      ],
      version: 0,
    })
  })

  test('page.update and page.remove work on existing pages', () => {
    const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL())
    const pageId = reportBuilder.page.add('Story One').build().pages[0].id

    reportBuilder.page.update(pageId, (page) => {
      page.setTitle('Story Two').setText('updated')
    })

    expect(reportBuilder.build().pages[0]).toMatchObject({
      id: pageId,
      title: 'Story Two',
      text: { content: 'updated' },
    })

    reportBuilder.page.remove(pageId)
    expect(reportBuilder.isEmpty()).toBe(true)
  })

  test('setChart copies chart DSL instead of sharing builder state', () => {
    const chartBuilder = VBI.createChart(VBI.generateEmptyChartDSL('demo'))
    const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL())
    const pageId = reportBuilder.page.add('Story One', (page) => page.setChart(chartBuilder)).build().pages[0].id

    chartBuilder.dimensions.add('area', (node) => {
      node.setAlias('Area')
    })

    expect(reportBuilder.page.get(pageId)?.chart.build().dimensions).toEqual([])
  })

  test('createReport uses default chart builder options from createVBI', () => {
    type CustomQueryDSL = { source: 'factory'; count: number }
    type CustomSeedDSL = { type: 'custom-seed'; queryDSL: CustomQueryDSL }

    const CustomVBI = createVBI<CustomQueryDSL, CustomSeedDSL>({
      adapters: {
        buildVQuery: ({ vbiDSL }) => ({ source: 'factory', count: vbiDSL.measures.length }),
        buildVSeed: async ({ queryDSL }) => ({ type: 'custom-seed', queryDSL }),
      },
    })

    const chartBuilder = CustomVBI.createChart(CustomVBI.generateEmptyChartDSL('demo'))
    const reportBuilder = CustomVBI.createReport(CustomVBI.generateEmptyReportDSL())
    const pageId = reportBuilder.page.add('Story One', (page) => page.setChart(chartBuilder)).build().pages[0].id

    expect(reportBuilder.page.get(pageId)?.chart.buildVQuery()).toEqual({
      source: 'factory',
      count: 0,
    })
  })

  test('report builders sync through YJS updates', () => {
    const b1 = VBI.createReport(VBI.generateEmptyReportDSL())
    const b2 = VBI.createReport(VBI.generateEmptyReportDSL())

    b2.applyUpdate(b1.encodeStateAsUpdate())
    b1.applyUpdate(b2.encodeStateAsUpdate())

    b1.page.add('Story One', (page) => page.setText('synced'))
    b2.applyUpdate(b1.encodeStateAsUpdate())

    expect(b2.build()).toEqual(b1.build())
  })
})
