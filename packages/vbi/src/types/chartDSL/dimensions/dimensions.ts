import { z } from 'zod'
import { zDimensionEncoding } from '@visactor/vseed'
import { zDimensionAggregate } from './aggregate'
import { zVBISort } from '../sort'

export const zVBIDimensionSchema = z.object({
  id: z.string(),
  field: z.string(),
  alias: z.string(),
  encoding: zDimensionEncoding.optional(),
  aggregate: zDimensionAggregate.optional(),
  sort: zVBISort.optional(),
})

export const zVBIDimensionGroupSchema: z.ZodType<VBIDimensionGroup> = z.object({
  alias: z.string(),
  children: z.lazy(() => z.array(z.union([zVBIDimensionSchema, zVBIDimensionGroupSchema]))),
})

export const zVBIDimensionTree = z.array(z.union([zVBIDimensionSchema, zVBIDimensionGroupSchema]))

export type VBIDimension = z.infer<typeof zVBIDimensionSchema>
export type VBIDimensionGroup = {
  alias: string
  children: (VBIDimension | VBIDimensionGroup)[]
}
export type VBIDimensionTree = z.infer<typeof zVBIDimensionTree>
