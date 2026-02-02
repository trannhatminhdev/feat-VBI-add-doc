import { z } from 'zod'

export const zPlayer = z.object({
  field: z.string(),
  interval: z.number().optional(),
  autoPlay: z.boolean().optional(),
})
