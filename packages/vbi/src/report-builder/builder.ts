import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIReportDSL, VBIReportBuilderInterface, VBIReportBuilderOptions } from 'src/types'
import { UndoManager, ReportPageCollectionBuilder } from './features'
import { applyUpdateToDoc, encodeDocStateAsUpdate, buildVBIReportDSL, isEmptyVBIReportDSL } from './modules'
import { getOrCreateReportPages } from 'src/vbi/from/report-page-y-map'

export class VBIReportBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>
  implements VBIReportBuilderInterface<TQueryDSL, TSeedDSL>
{
  public doc: Y.Doc
  public dsl: Y.Map<any>
  public undoManager: UndoManager
  public page: ReportPageCollectionBuilder<TQueryDSL, TSeedDSL>

  constructor(doc: Y.Doc, options?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>) {
    this.doc = doc
    this.dsl = doc.getMap('dsl') as Y.Map<any>

    doc.transact(() => {
      getOrCreateReportPages(this.dsl)
      if (this.dsl.get('version') === undefined) {
        this.dsl.set('version', 0)
      }
    })

    this.undoManager = new UndoManager(this.dsl)
    this.page = new ReportPageCollectionBuilder<TQueryDSL, TSeedDSL>(this, doc, this.dsl, options)
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin?: any) => {
    return applyUpdateToDoc(this.doc, update, transactionOrigin)
  }

  public encodeStateAsUpdate = (targetStateVector?: Uint8Array) => {
    return encodeDocStateAsUpdate(this.doc, targetStateVector)
  }

  public build = (): VBIReportDSL => buildVBIReportDSL(this.dsl)

  public isEmpty = (): boolean => isEmptyVBIReportDSL(this.dsl)
}
