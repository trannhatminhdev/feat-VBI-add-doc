import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import type { VBIDSL } from '../dsl'
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
} from 'src/builder/features'
import type { Map, Doc } from 'yjs'

export interface VBIBuilderInterface<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
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

  buildVSeed: () => Promise<TSeedDSL>
  buildVQuery: () => TQueryDSL
  build: () => VBIDSL
  isEmpty: () => boolean
}
