import type { VBIReportDSL } from 'src/types'
import { id } from 'src/utils'

export const generateEmptyReportDSL = (uuid: string = id.resourceUUID()): VBIReportDSL => {
  return {
    uuid,
    pages: [],
    version: 0,
  }
}
