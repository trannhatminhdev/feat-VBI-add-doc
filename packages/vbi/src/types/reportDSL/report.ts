import { z } from 'zod'
import { zVBIReportPageDSL } from './page'

export const zVBIReportDSL = z.object({
  pages: z.array(zVBIReportPageDSL).optional().default([]),
  version: z.number().int().min(0).optional().default(0),
})

export type VBIReportDSLInput = z.input<typeof zVBIReportDSL>
export type VBIReportDSL = z.output<typeof zVBIReportDSL>
