import { zVBIReportDSL } from 'src/types/reportDSL/report'
import { generateEmptyReportDSL } from 'src/vbi/generate-empty-report-dsl'
import { generateEmptyReportPageDSL } from 'src/vbi/generate-empty-report-page-dsl'

describe('report DSL schemas', () => {
  test('parse minimal report DSL', () => {
    expect(zVBIReportDSL.parse(generateEmptyReportDSL())).toEqual({
      uuid: 'uuid-1',
      pages: [],
      version: 0,
    })
  })

  test('page requires title and normalizes references', () => {
    const page = generateEmptyReportPageDSL()
    const withoutTitle: Partial<typeof page> = { ...page }
    const withoutChartId: Partial<typeof page> = { ...page }
    const withoutInsightId: Partial<typeof page> = { ...page }

    delete withoutTitle.title
    delete withoutChartId.chartId
    delete withoutInsightId.insightId

    expect(() => zVBIReportDSL.parse({ pages: [withoutTitle], version: 0 })).toThrow()
    expect(zVBIReportDSL.parse({ pages: [withoutChartId], version: 0 }).pages[0].chartId).toBe('')
    expect(zVBIReportDSL.parse({ pages: [withoutInsightId], version: 0 }).pages[0].insightId).toBe('')
  })

  test('page reference fields use string validation', () => {
    const page = generateEmptyReportPageDSL()

    expect(() => zVBIReportDSL.parse({ pages: [{ ...page, chartId: 1 }], version: 0 })).toThrow()
    expect(() => zVBIReportDSL.parse({ pages: [{ ...page, insightId: 1 }], version: 0 })).toThrow()
  })

  test('empty report helpers stay stable', () => {
    expect(generateEmptyReportPageDSL()).toEqual({
      id: 'id-1',
      title: '',
      chartId: '',
      insightId: '',
    })
  })

  test('report helper accepts custom uuid', () => {
    expect(generateEmptyReportDSL('report-uuid')).toEqual({
      uuid: 'report-uuid',
      pages: [],
      version: 0,
    })
  })

  test('report page helper accepts custom id', () => {
    expect(generateEmptyReportPageDSL('page-id')).toEqual({
      id: 'page-id',
      title: '',
      chartId: '',
      insightId: '',
    })
  })
})
