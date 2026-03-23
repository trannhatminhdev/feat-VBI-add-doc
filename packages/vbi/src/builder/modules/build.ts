import * as Y from 'yjs'
import type { VBIChartDSL } from 'src/types'

export const buildVBIChartDSL = (dsl: Y.Map<any>): VBIChartDSL => {
  return dsl.toJSON() as VBIChartDSL
}
