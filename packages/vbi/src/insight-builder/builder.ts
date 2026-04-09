import * as Y from 'yjs'
import type { VBIInsightBuilderInterface, VBIInsightDSL } from 'src/types'
import { UndoManager } from 'src/chart-builder/features'
import { applyUpdateToDoc, buildVBIInsightDSL, encodeDocStateAsUpdate, isEmptyVBIInsightDSL } from './modules'
import { ensureResourceUUID, getResourceUUID } from 'src/vbi/resource-uuid'

export class VBIInsightBuilder implements VBIInsightBuilderInterface {
  public doc: Y.Doc
  public dsl: Y.Map<any>
  public undoManager: UndoManager

  constructor(doc: Y.Doc, dsl?: Y.Map<any>) {
    this.doc = doc
    this.dsl = (dsl ?? doc.getMap('dsl')) as Y.Map<any>

    doc.transact(() => {
      ensureResourceUUID(this.dsl)
      if (this.dsl.get('content') === undefined) {
        this.dsl.set('content', '')
      }
      if (this.dsl.get('version') === undefined) {
        this.dsl.set('version', 0)
      }
    })

    this.undoManager = new UndoManager(this.dsl)
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin?: any) => {
    return applyUpdateToDoc(this.doc, update, transactionOrigin)
  }

  public encodeStateAsUpdate = (targetStateVector?: Uint8Array) => {
    return encodeDocStateAsUpdate(this.doc, targetStateVector)
  }

  public getUUID = (): string => getResourceUUID(this.dsl)

  public setContent = (content: string) => {
    this.dsl.set('content', content)
    return this
  }

  public build = (): VBIInsightDSL => buildVBIInsightDSL(this.dsl)

  public isEmpty = (): boolean => isEmptyVBIInsightDSL(this.dsl)
}
