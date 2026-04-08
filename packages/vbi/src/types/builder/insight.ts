import type { UndoManager } from 'src/chart-builder/features'
import type { Doc, Map } from 'yjs'
import type { VBIInsightDSL } from '../insightDSL'

export interface VBIInsightBuilderInterface {
  doc: Doc
  dsl: Map<any>
  undoManager: UndoManager

  applyUpdate: (update: Uint8Array, origin?: any) => void
  encodeStateAsUpdate: (targetStateVector?: Uint8Array) => Uint8Array

  getUUID: () => string
  setContent: (content: string) => VBIInsightBuilderInterface
  build: () => VBIInsightDSL
  isEmpty: () => boolean
}
