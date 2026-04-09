import { z } from 'zod'

export const zVBIReportPageDSL = z.object({
  id: z.string(),
  title: z.string(),
  chartId: z.string().optional().default(''),
  insightId: z.string().optional().default(''),
})

export type VBIReportPageDSLInput = z.input<typeof zVBIReportPageDSL>
export type VBIReportPageDSL = z.output<typeof zVBIReportPageDSL>
