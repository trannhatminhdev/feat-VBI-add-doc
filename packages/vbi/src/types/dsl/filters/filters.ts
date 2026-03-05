import { z } from 'zod'

export const zVBIFilter = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  field: z.string(),
  actionType: z.enum(['filter', 'sort']).optional(),
  operator: z.string().optional(),
  value: z.any().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
  enabled: z.boolean().optional().default(true),
})

export type VBIFilter = z.infer<typeof zVBIFilter>
