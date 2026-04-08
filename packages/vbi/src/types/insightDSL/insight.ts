import { z } from 'zod'

export const zVBIInsightDSL = z.object({
  uuid: z.string().optional().default(''),
  content: z.string().optional().default(''),
  version: z.number().int().min(0).optional().default(0),
})

export type VBIInsightDSLInput = z.input<typeof zVBIInsightDSL>
export type VBIInsightDSL = z.output<typeof zVBIInsightDSL>
