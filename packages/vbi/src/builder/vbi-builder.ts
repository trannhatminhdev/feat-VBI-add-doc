import * as Y from 'yjs'

import { VSeedDSL } from '@visactor/vseed'
import { VQueryDSL } from '@visactor/vquery'
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

import { VBIDSL, VBIBuilderInterface } from 'src/types'
import { buildVQuery } from 'src/pipeline'
import { getConnector } from './connector'

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
  public applyUpdate(update: Uint8Array) {
    Y.applyUpdate(this.doc, update)
  }
  public encodeStateAsUpdate(targetStateVector?: Uint8Array) {
    return Y.encodeStateAsUpdate(this.doc, targetStateVector)
  }
  public buildVSeed = async (): Promise<VSeedDSL> => {
    const vbiDSL = this.build()
    const connectorId = vbiDSL.connectorId
    const connector = await getConnector(vbiDSL.connectorId)

    const queryDSL = this.buildVQuery()
    const schema = await connector.discoverSchema()
    const queryResult = await connector.query({ queryDSL, schema, connectorId })

    return {
      chartType: vbiDSL.chartType,
      dataset: queryResult.dataset,
      theme: vbiDSL.theme,
      locale: vbiDSL.locale,
    } as VSeedDSL
  }
  public buildVQuery = (): VQueryDSL => {
    const vbiDSL = this.build()
    return buildVQuery(vbiDSL, this)
  }
  public build = (): VBIDSL => {
    return this.dsl.toJSON() as VBIDSL
  }

  public isEmpty = (): boolean => {
    const getLength = (value: any): number => {
      if (value instanceof Y.Array) {
        return value.length
      }

      if (Array.isArray(value)) {
        return value.length
      }

      return 0
    }

    const dimensionsLength = getLength(this.dsl.get('dimensions'))
    const measuresLength = getLength(this.dsl.get('measures'))

    return dimensionsLength === 0 && measuresLength === 0
  }

  public getSchema = async () => {
    const connectorId = this.dsl.get('connectorId')
    const con = await getConnector(connectorId)
    const result = await con.discoverSchema()
    return result
  }
}
