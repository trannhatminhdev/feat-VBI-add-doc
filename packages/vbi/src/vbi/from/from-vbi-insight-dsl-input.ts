import * as Y from 'yjs'
import type { VBIInsightDSLInput } from 'src/types'
import { zVBIInsightDSL } from 'src/types/insightDSL/insight'
import { VBIInsightBuilder } from 'src/insight-builder/builder'

export const createInsightBuilderFromVBIInsightDSLInput = (insight: VBIInsightDSLInput) => {
  const doc = new Y.Doc()
  const dsl = doc.getMap('dsl')
  const normalized = zVBIInsightDSL.parse(insight)

  doc.transact(() => {
    dsl.set('uuid', normalized.uuid)
    dsl.set('content', normalized.content)
    dsl.set('version', normalized.version)
  })

  return new VBIInsightBuilder(doc, dsl)
}
