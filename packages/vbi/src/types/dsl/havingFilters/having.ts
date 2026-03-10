import { z } from 'zod'

export const zVBIHavingFilter = z.object({
  id: z.string(),
  field: z.string(),
  operator: z.string().optional(),
  value: z.any().optional(),
})

export type VBIHavingFilter = z.infer<typeof zVBIHavingFilter>

export const zVBIHavingGroup: z.ZodType<VBIHavingGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    op: z.enum(['and', 'or']),
    conditions: z.array(zVBIHavingClause),
  }),
)

export const zVBIHavingClause: z.ZodType<VBIHavingClause> = z.lazy(() => z.union([zVBIHavingFilter, zVBIHavingGroup]))

export type VBIHavingGroup = {
  id: string
  op: 'and' | 'or'
  conditions: VBIHavingClause[]
}

export type VBIHavingClause = VBIHavingFilter | VBIHavingGroup

export function isVBIHavingFilter(clause: VBIHavingClause): clause is VBIHavingFilter {
  return 'field' in clause
}

export function isVBIHavingGroup(clause: VBIHavingClause): clause is VBIHavingGroup {
  return 'conditions' in clause
}
