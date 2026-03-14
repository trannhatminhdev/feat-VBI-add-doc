import { z } from 'zod'

const zWhereLogicalOperator = z.enum(['and', 'or'])

export const zVBIFilter = z.object({
  id: z.string(),
  field: z.string(),
  op: z.string().optional(),
  value: z.any().optional(),
})

export type VBIFilter = z.infer<typeof zVBIFilter>

type VBIWhereBranch = {
  id: string
  op: z.infer<typeof zWhereLogicalOperator>
  conditions: VBIWhereClause[]
}

export type VBIWhereGroup = VBIWhereBranch
export type VBIWhereClause = VBIFilter | VBIWhereGroup

export const zVBIWhereGroup: z.ZodType<VBIWhereGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    op: zWhereLogicalOperator,
    conditions: z.array(zVBIWhereClause),
  }),
)

export const zVBIWhereClause: z.ZodType<VBIWhereClause> = z.lazy(() => z.union([zVBIFilter, zVBIWhereGroup]))

export function isVBIFilter(clause: VBIWhereClause): clause is VBIFilter {
  return 'field' in clause
}

export function isVBIWhereGroup(clause: VBIWhereClause): clause is VBIWhereGroup {
  return 'conditions' in clause
}
