import * as Y from 'yjs'
import type { VBIReportDSL } from 'src/types'
import { zVBIReportDSL } from 'src/types/reportDSL/report'

export const buildVBIReportDSL = (dsl: Y.Map<any>): VBIReportDSL => {
  return zVBIReportDSL.parse(dsl.toJSON())
}
