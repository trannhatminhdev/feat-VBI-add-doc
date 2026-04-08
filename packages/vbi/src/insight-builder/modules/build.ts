import * as Y from 'yjs'
import type { VBIInsightDSL } from 'src/types'
import { zVBIInsightDSL } from 'src/types/insightDSL/insight'

export const buildVBIInsightDSL = (dsl: Y.Map<any>): VBIInsightDSL => {
  return zVBIInsightDSL.parse(dsl.toJSON())
}
