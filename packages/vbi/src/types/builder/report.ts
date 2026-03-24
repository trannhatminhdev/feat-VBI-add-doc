import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { ReportPageCollectionBuilder } from 'src/report-builder/features/page'
import type { UndoManager } from 'src/chart-builder/features'
import type { Doc, Map } from 'yjs'
import type { VBIReportDSL } from '../reportDSL'
import type { VBIChartBuilderOptions } from './adapter'

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

  build: () => VBIReportDSL
  isEmpty: () => boolean
}
