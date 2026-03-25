import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartBuilderOptions, VBIChartDSLInput, VBIReportPageDSL } from 'src/types'
import { VBIChartBuilder } from 'src/chart-builder/builder'
import { fillVBIChartDSLMap } from 'src/vbi/from/fill-vbi-chart-dsl-map'
import { getOrCreateReportChartMap, getOrCreateReportTextMap } from 'src/vbi/from/report-page-y-map'
import { ReportTextBuilder } from './text-builder'

const isChartBuilderLike = (value: unknown): value is { build: () => VBIChartDSLInput } => {
  return typeof value === 'object' && value !== null && typeof (value as { build?: unknown }).build === 'function'
}

export class ReportPageBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  public chart: VBIChartBuilder<TQueryDSL, TSeedDSL>
  public text: ReportTextBuilder

  constructor(
    private doc: Y.Doc,
    private page: Y.Map<any>,
    chartOptions?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  ) {
    this.chart = new VBIChartBuilder<TQueryDSL, TSeedDSL>(doc, chartOptions, getOrCreateReportChartMap(page))
    this.text = new ReportTextBuilder(getOrCreateReportTextMap(page))
  }

  getId(): string {
    return this.page.get('id')
  }

  setTitle(title: string): this {
    this.page.set('title', title)
    return this
  }

  setChart(chartBuilder: VBIChartBuilder<TQueryDSL, TSeedDSL> | VBIChartDSLInput): this {
    const chartDSL = isChartBuilderLike(chartBuilder) ? chartBuilder.build() : chartBuilder
    this.doc.transact(() => {
      fillVBIChartDSLMap(this.chart.dsl, chartDSL)
    })
    return this
  }

  setText(content: string): this {
    this.text.setContent(content)
    return this
  }

  toJSON(): VBIReportPageDSL {
    return this.page.toJSON() as VBIReportPageDSL
  }
}
