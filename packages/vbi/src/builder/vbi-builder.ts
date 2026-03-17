import * as Y from 'yjs'

import type { VSeedDSL } from '@visactor/vseed'
import type { VQueryDSL } from '@visactor/vquery'
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

import type { VBIDSL, VBIBuilderInterface } from 'src/types'
import {
  applyUpdateToDoc,
  encodeDocStateAsUpdate,
  buildVBIDSL,
  buildVQueryDSL,
  buildVSeedDSL,
  isEmptyVBIDSL,
  getBuilderSchema,
  createBuilderFeatures,
} from './modules'

export class VBIBuilder implements VBIBuilderInterface {
  public doc: Y.Doc
  public dsl: Y.Map<any>

  public chartType: ChartTypeBuilder
  public measures: MeasuresBuilder
  public dimensions: DimensionsBuilder
  public havingFilter: HavingFilterBuilder
  public whereFilter: WhereFilterBuilder
  public theme: ThemeBuilder
  public locale: LocaleBuilder
  public limit: LimitBuilder
  public undoManager: UndoManager

  constructor(doc: Y.Doc) {
    this.doc = doc
    this.dsl = doc.getMap('dsl') as Y.Map<any>

    const features = createBuilderFeatures(doc, this.dsl)
    this.undoManager = features.undoManager
    this.chartType = features.chartType
    this.measures = features.measures
    this.dimensions = features.dimensions
    this.havingFilter = features.havingFilter
    this.whereFilter = features.whereFilter
    this.theme = features.theme
    this.locale = features.locale
    this.limit = features.limit
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin?: any) => {
    return applyUpdateToDoc(this.doc, update, transactionOrigin)
  }

  public encodeStateAsUpdate = (targetStateVector?: Uint8Array) => {
    return encodeDocStateAsUpdate(this.doc, targetStateVector)
  }

  public buildVSeed = async (): Promise<VSeedDSL> => {
    const vbiDSL = this.build()
    const queryDSL = this.buildVQuery()
    return buildVSeedDSL({ vbiDSL, queryDSL })
  }

  public buildVQuery = (): VQueryDSL => buildVQueryDSL(this.dsl, this)

  public build = (): VBIDSL => buildVBIDSL(this.dsl)

  public isEmpty = (): boolean => isEmptyVBIDSL(this.dsl)

  public getSchema = async () => getBuilderSchema(this.dsl)
}
