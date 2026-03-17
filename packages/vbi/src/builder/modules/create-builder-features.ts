import * as Y from 'yjs'
import {
  DimensionsBuilder,
  MeasuresBuilder,
  HavingFilterBuilder,
  WhereFilterBuilder,
  ChartTypeBuilder,
  ThemeBuilder,
  LocaleBuilder,
  LimitBuilder,
  UndoManager,
} from '../features'

export interface BuilderFeatureInstances {
  chartType: ChartTypeBuilder
  measures: MeasuresBuilder
  dimensions: DimensionsBuilder
  havingFilter: HavingFilterBuilder
  whereFilter: WhereFilterBuilder
  theme: ThemeBuilder
  locale: LocaleBuilder
  limit: LimitBuilder
  undoManager: UndoManager
}

export const createBuilderFeatures = (doc: Y.Doc, dsl: Y.Map<any>): BuilderFeatureInstances => {
  return {
    undoManager: new UndoManager(dsl),
    chartType: new ChartTypeBuilder(doc, dsl),
    measures: new MeasuresBuilder(doc, dsl),
    dimensions: new DimensionsBuilder(doc, dsl),
    havingFilter: new HavingFilterBuilder(doc, dsl),
    whereFilter: new WhereFilterBuilder(doc, dsl),
    theme: new ThemeBuilder(doc, dsl),
    locale: new LocaleBuilder(doc, dsl),
    limit: new LimitBuilder(doc, dsl),
  }
}
