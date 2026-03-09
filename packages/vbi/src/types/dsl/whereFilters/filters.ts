import { z } from 'zod'

export const zVBIFilter = z.object({
  field: z.string(),
  operator: z.string().optional(),
  value: z.any().optional(),
})

export type VBIFilter = z.infer<typeof zVBIFilter>
