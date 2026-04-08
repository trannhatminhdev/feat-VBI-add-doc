import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartDSL } from '../chartDSL'
import type { BuildVSeedOptions } from './build-vseed'
import type {
  MeasuresBuilder,
  DimensionsBuilder,
  ChartTypeBuilder,
  HavingFilterBuilder,
  WhereFilterBuilder,
  ThemeBuilder,
  LocaleBuilder,
  LimitBuilder,
  UndoManager,
} from 'src/chart-builder/features'
import type { Map, Doc } from 'yjs'

export interface VBIChartBuilderInterface<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  doc: Doc
  dsl: Map<any>
  undoManager: UndoManager

  chartType: ChartTypeBuilder
  measures: MeasuresBuilder
  dimensions: DimensionsBuilder
  havingFilter: HavingFilterBuilder
  whereFilter: WhereFilterBuilder
  theme: ThemeBuilder
  locale: LocaleBuilder
  limit: LimitBuilder

  applyUpdate: (update: Uint8Array, origin?: any) => void
  encodeStateAsUpdate: (targetStateVector?: Uint8Array) => Uint8Array

  getUUID: () => string
  buildVSeed: (options?: BuildVSeedOptions) => Promise<TSeedDSL>
  buildVQuery: () => TQueryDSL
  build: () => VBIChartDSL
  isEmpty: () => boolean
}
