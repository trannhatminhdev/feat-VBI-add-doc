import { zVBIReportDSL } from 'src/types/reportDSL/report'
import { generateEmptyReportDSL } from 'src/vbi/generate-empty-report-dsl'
import { generateEmptyReportPageDSL } from 'src/vbi/generate-empty-report-page-dsl'

describe('report DSL schemas', () => {
  test('parse minimal report DSL', () => {
    expect(zVBIReportDSL.parse(generateEmptyReportDSL())).toEqual({
      pages: [],
      version: 0,
    })
  })

  test('page requires title, chart and text', () => {
    const page = generateEmptyReportPageDSL('demo')
    const withoutTitle: Partial<typeof page> = { ...page }
    const withoutChart: Partial<typeof page> = { ...page }
    const withoutText: Partial<typeof page> = { ...page }

    delete withoutTitle.title
    delete withoutChart.chart
    delete withoutText.text

    expect(() => zVBIReportDSL.parse({ pages: [withoutTitle], version: 0 })).toThrow()
    expect(() => zVBIReportDSL.parse({ pages: [withoutChart], version: 0 })).toThrow()
    expect(zVBIReportDSL.parse({ pages: [withoutText], version: 0 }).pages[0].text).toEqual({ content: '' })
  })

  test('page.chart reuses chart schema validation', () => {
    const page = generateEmptyReportPageDSL('demo')

    expect(() =>
      zVBIReportDSL.parse({
        pages: [{ ...page, chart: { ...page.chart, connectorId: 1 } }],
        version: 0,
      }),
    ).toThrow()
  })

  test('empty report helpers stay stable', () => {
    expect(generateEmptyReportPageDSL('demo')).toEqual({
      id: 'id-1',
      title: '',
      chart: {
        connectorId: 'demo',
        chartType: 'table',
        measures: [],
        dimensions: [],
        whereFilter: { id: 'root', op: 'and', conditions: [] },
        havingFilter: { id: 'root', op: 'and', conditions: [] },
        theme: 'light',
        locale: 'zh-CN',
        version: 0,
      },
      text: {
        content: '',
      },
    })
  })
})
