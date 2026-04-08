import * as Y from 'yjs'
import type { VBIChartBuilder } from 'src/chart-builder/builder'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIInsightBuilder } from 'src/insight-builder/builder'
import type { VBIReportDSL, VBIReportBuilderInterface, VBIReportBuilderOptions, VBIReportSnapshotDSL } from 'src/types'
import { UndoManager, ReportPageCollectionBuilder } from './features'
import {
  applyUpdateToDoc,
  buildVBIReportDSL,
  buildVBIReportSnapshotDSL,
  encodeDocStateAsUpdate,
  isEmptyVBIReportDSL,
} from './modules'
import { getOrCreateReportPages } from 'src/vbi/from/report-page-y-map'
import { type VBIResourceRegistry, resolveChartBuilder, resolveInsightBuilder } from 'src/vbi/resource-registry'
import { ensureResourceUUID, getResourceUUID } from 'src/vbi/resource-uuid'

export class VBIReportBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>
  implements VBIReportBuilderInterface<TQueryDSL, TSeedDSL>
{
  public doc: Y.Doc
  public dsl: Y.Map<any>
  public undoManager: UndoManager
  public page: ReportPageCollectionBuilder<TQueryDSL, TSeedDSL>

  constructor(
    doc: Y.Doc,
    private options?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
    private resourceRegistry?: VBIResourceRegistry,
  ) {
    this.doc = doc
    this.dsl = doc.getMap('dsl') as Y.Map<any>

    doc.transact(() => {
      ensureResourceUUID(this.dsl)
      getOrCreateReportPages(this.dsl)
      if (this.dsl.get('version') === undefined) {
        this.dsl.set('version', 0)
      }
    })

    this.undoManager = new UndoManager(this.dsl)
    this.page = new ReportPageCollectionBuilder<TQueryDSL, TSeedDSL>(this, doc, this.dsl)
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin?: any) => {
    return applyUpdateToDoc(this.doc, update, transactionOrigin)
  }

  public encodeStateAsUpdate = (targetStateVector?: Uint8Array) => {
    return encodeDocStateAsUpdate(this.doc, targetStateVector)
  }

  public getUUID = (): string => getResourceUUID(this.dsl)

  public getChartBuilder = (chartId: string): VBIChartBuilder<TQueryDSL, TSeedDSL> | undefined => {
    if (!this.resourceRegistry || !chartId) {
      return undefined
    }
    return resolveChartBuilder(this.resourceRegistry, chartId, this.options?.chart)
  }

  public getInsightBuilder = (insightId: string): VBIInsightBuilder | undefined => {
    if (!this.resourceRegistry || !insightId) {
      return undefined
    }
    return resolveInsightBuilder(this.resourceRegistry, insightId)
  }

  public build = (): VBIReportDSL => buildVBIReportDSL(this.dsl)

  public snapshot = (): VBIReportSnapshotDSL => {
    if (!this.resourceRegistry) {
      throw new Error('Report snapshot requires a resource registry')
    }
    return buildVBIReportSnapshotDSL(this.build(), this.resourceRegistry)
  }

  public isEmpty = (): boolean => isEmptyVBIReportDSL(this.dsl)
}
