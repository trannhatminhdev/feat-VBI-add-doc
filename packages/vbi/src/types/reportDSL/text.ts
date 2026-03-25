import { z } from 'zod'

export const zVBIReportTextDSL = z.object({
  content: z.string().optional().default(''),
})

export type VBIReportTextDSLInput = z.input<typeof zVBIReportTextDSL>
export type VBIReportTextDSL = z.output<typeof zVBIReportTextDSL>
