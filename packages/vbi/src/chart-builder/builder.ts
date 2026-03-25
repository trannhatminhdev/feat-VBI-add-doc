import * as Y from 'yjs'

import { resolveVBIChartBuilderAdapters } from 'src/chart-builder/adapters/vquery-vseed'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed'
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
} from './features'

import type {
  BuildVSeedOptions,
  VBIChartDSL,
  VBIChartBuilderAdapters,
  VBIChartBuilderInterface,
  VBIChartBuilderOptions,
} from 'src/types'
import {
  applyUpdateToDoc,
  encodeDocStateAsUpdate,
  buildVBIChartDSL,
  isEmptyVBIChartDSL,
  getBuilderSchema,
} from './modules'

export class VBIChartBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>
  implements VBIChartBuilderInterface<TQueryDSL, TSeedDSL>
{
  public doc: Y.Doc
  public dsl: Y.Map<any>
  public adapters: VBIChartBuilderAdapters<TQueryDSL, TSeedDSL>

  public chartType: ChartTypeBuilder
  public measures: MeasuresBuilder
  public dimensions: DimensionsBuilder
  public havingFilter: HavingFilterBuilder
  public whereFilter: WhereFilterBuilder
  public theme: ThemeBuilder
  public locale: LocaleBuilder
  public limit: LimitBuilder
  public undoManager: UndoManager

  constructor(doc: Y.Doc, options?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>, dsl?: Y.Map<any>) {
    this.doc = doc
    this.dsl = (dsl ?? doc.getMap('dsl')) as Y.Map<any>
    this.adapters = resolveVBIChartBuilderAdapters(options?.adapters)

    this.undoManager = new UndoManager(this.dsl)
    this.chartType = new ChartTypeBuilder(doc, this.dsl)
    this.measures = new MeasuresBuilder(doc, this.dsl)
    this.dimensions = new DimensionsBuilder(doc, this.dsl)
    this.havingFilter = new HavingFilterBuilder(doc, this.dsl)
    this.whereFilter = new WhereFilterBuilder(doc, this.dsl)
    this.theme = new ThemeBuilder(doc, this.dsl)
    this.locale = new LocaleBuilder(doc, this.dsl)
    this.limit = new LimitBuilder(doc, this.dsl)
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin?: any) => {
    return applyUpdateToDoc(this.doc, update, transactionOrigin)
  }

  public encodeStateAsUpdate = (targetStateVector?: Uint8Array) => {
    return encodeDocStateAsUpdate(this.doc, targetStateVector)
  }

  public buildVSeed = async (options: BuildVSeedOptions = {}): Promise<TSeedDSL> => {
    const vbiDSL = this.build()
    const queryDSL = this.adapters.buildVQuery({
      dsl: this.dsl,
      vbiDSL,
      builder: this,
    })
    return this.adapters.buildVSeed({
      dsl: this.dsl,
      vbiDSL,
      queryDSL,
      options,
      builder: this,
    })
  }

  public buildVQuery = (): TQueryDSL => {
    const vbiDSL = this.build()
    return this.adapters.buildVQuery({
      dsl: this.dsl,
      vbiDSL,
      builder: this,
    })
  }

  public build = (): VBIChartDSL => buildVBIChartDSL(this.dsl)

  public isEmpty = (): boolean => isEmptyVBIChartDSL(this.dsl)

  public getSchema = async () => getBuilderSchema(this.dsl)
}
