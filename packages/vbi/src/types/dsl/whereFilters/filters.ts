import { z } from 'zod'

export const zVBIFilter = z.object({
  id: z.string(),
  field: z.string(),
  op: z.string().optional(),
  value: z.any().optional(),
})

export type VBIFilter = z.infer<typeof zVBIFilter>

export const zVBIWhereGroup: z.ZodType<VBIWhereGroup> = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    op: z.enum(['and', 'or']),
    conditions: z.array(zVBIWhereClause),
  }),
)

export const zVBIWhereClause: z.ZodType<VBIWhereClause> = z.lazy(() => z.union([zVBIFilter, zVBIWhereGroup]))

export type VBIWhereGroup = {
  id?: string
  op: 'and' | 'or'
  conditions: VBIWhereClause[]
}

export type VBIWhereClause = VBIFilter | VBIWhereGroup

export function isVBIFilter(clause: VBIWhereClause): clause is VBIFilter {
  return 'field' in clause
}

export function isVBIWhereGroup(clause: VBIWhereClause): clause is VBIWhereGroup {
  return 'conditions' in clause
}
