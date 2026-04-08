import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { ReportPageCollectionBuilder } from 'src/report-builder/features/page'
import type { UndoManager } from 'src/chart-builder/features'
import type { VBIChartBuilder } from 'src/chart-builder/builder'
import type { VBIInsightBuilder } from 'src/insight-builder/builder'
import type { Doc, Map } from 'yjs'
import type { VBIReportDSL, VBIReportSnapshotDSL } from '../reportDSL'
import type { VBIChartBuilderOptions } from './adapter'
import type { VBIChartDSLInput } from '../chartDSL'
import type { VBIInsightDSLInput } from '../insightDSL'

export interface VBIReportBuilderOptions<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  chart?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>
}

export interface VBIReportBuilderInterface<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  doc: Doc
  dsl: Map<any>
  undoManager: UndoManager
  page: ReportPageCollectionBuilder<TQueryDSL, TSeedDSL>

  applyUpdate: (update: Uint8Array, origin?: any) => void
  encodeStateAsUpdate: (targetStateVector?: Uint8Array) => Uint8Array

  getUUID: () => string
  createChart: (chart: VBIChartDSLInput) => VBIChartBuilder<TQueryDSL, TSeedDSL>
  createInsight: (insight: VBIInsightDSLInput) => VBIInsightBuilder
  getChartBuilder: (chartId: string) => VBIChartBuilder<TQueryDSL, TSeedDSL> | undefined
  getInsightBuilder: (insightId: string) => VBIInsightBuilder | undefined
  build: () => VBIReportDSL
  snapshot: () => VBIReportSnapshotDSL
  isEmpty: () => boolean
}
