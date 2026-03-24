import type { VBIReportDSL } from 'src/types'

export const generateEmptyReportDSL = (): VBIReportDSL => {
  return {
    pages: [],
    version: 0,
  }
}
