import { z } from 'zod'

export const zVBIHavingFilter = z.object({
  field: z.string(),
  operator: z.string().optional(),
  value: z.any().optional(),
})

export type VBIHavingFilter = z.infer<typeof zVBIHavingFilter>

export const zVBIHavingArray = z.array(zVBIHavingFilter)

export type VBIHavingArray = z.infer<typeof zVBIHavingArray>
