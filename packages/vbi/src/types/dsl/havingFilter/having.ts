import { z } from 'zod'

const zHavingLogicalOperator = z.enum(['and', 'or'])

export const zVBIHavingFilter = z.object({
  id: z.string(),
  field: z.string(),
  op: z.string().optional(),
  value: z.any().optional(),
})

export type VBIHavingFilter = z.infer<typeof zVBIHavingFilter>

type VBIHavingBranch = {
  id: string
  op: z.infer<typeof zHavingLogicalOperator>
  conditions: VBIHavingClause[]
}

export type VBIHavingGroup = VBIHavingBranch
export type VBIHavingClause = VBIHavingFilter | VBIHavingGroup

export const zVBIHavingGroup: z.ZodType<VBIHavingGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    op: zHavingLogicalOperator,
    conditions: z.array(zVBIHavingClause),
  }),
)

export const zVBIHavingClause: z.ZodType<VBIHavingClause> = z.lazy(() => z.union([zVBIHavingFilter, zVBIHavingGroup]))

export function isVBIHavingFilter(clause: VBIHavingClause): clause is VBIHavingFilter {
  return 'field' in clause
}

export function isVBIHavingGroup(clause: VBIHavingClause): clause is VBIHavingGroup {
  return 'conditions' in clause
}
