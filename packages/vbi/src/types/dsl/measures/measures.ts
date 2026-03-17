import { z } from 'zod'
import { zAggregate } from './aggregate'

export const zVBIMeasure = z.object({
  id: z.string(),
  field: z.string(),
  alias: z.string(),
  encoding: z.enum(['yAxis', 'xAxis', 'color', 'label', 'tooltip', 'size']),
  aggregate: zAggregate,
})
export const zVBIMeasureGroup: z.ZodType<VBIMeasureGroup> = z.object({
  alias: z.string(),
  children: z.lazy(() => z.array(z.union([zVBIMeasure, zVBIMeasureGroup]))),
})
export const zVBIMeasureTree = z.array(z.union([zVBIMeasure, zVBIMeasureGroup]))

export type VBIMeasure = z.infer<typeof zVBIMeasure>
export type VBIMeasureGroup = {
  alias: string
  children: (VBIMeasure | VBIMeasureGroup)[]
}
export type VBIMeasureTree = z.infer<typeof zVBIMeasureTree>
