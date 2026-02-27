import { z } from 'zod'

export const zRowOrColumnTotalConfig = z.object({
  showGrandTotals: z.boolean().optional(),
  showSubTotals: z.boolean().optional(),
  subTotalsDimensions: z.array(z.string()).optional(),
})

export const zPivotTableTotals = z.object({
  row: zRowOrColumnTotalConfig.optional(),
  column: zRowOrColumnTotalConfig.optional(),
})
