import { z } from 'zod'
import { zDimensionEncoding } from '../encoding'
import { zTimeFormat } from '../format'
import type { DimensionGroup } from './tableDimension'

export const zDimension = z.object({
  id: z.string(),
  alias: z.string().optional(),
  encoding: zDimensionEncoding.optional(),
  timeFormat: zTimeFormat.optional(),
})
export const zDimensionGroup: z.ZodType<DimensionGroup> = z.object({
  id: z.string(),
  alias: z.string().optional(),
  get children() {
    return z.array(zDimensionGroup.or(zDimension)).optional()
  },
})
export const zDimensions = z.array(zDimension)
export const zDimensionTree = z.array(zDimensionGroup.or(zDimension))
