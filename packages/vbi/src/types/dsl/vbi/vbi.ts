import { z } from 'zod'
import { zVBIDimensionTree } from '../dimensions/dimensions'
import { zVBIMeasureTree } from '../measures/measures'
import { zVBIDSLTheme } from '../theme/theme'
import { zVBIDSLLocale } from '../locale/locale'
import { zVBIWhereGroup } from '../whereFilter/filters'
import { zVBIHavingGroup } from '../havingFilter/having'

export const zVBIDSL = z.object({
  connectorId: z.string(),
  chartType: z.custom<any>(), // Use any to avoid circular dependency or simplify for now
  dimensions: zVBIDimensionTree,
  measures: zVBIMeasureTree,
  havingFilter: zVBIHavingGroup.optional().default({
    id: 'root',
    op: 'and',
    conditions: [],
  }),
  whereFilter: zVBIWhereGroup.optional().default({
    id: 'root',
    op: 'and',
    conditions: [],
  }),
  theme: zVBIDSLTheme,
  locale: zVBIDSLLocale,
  limit: z.number().int().min(1).optional(),
  version: z.number().int().min(0),
})

export type VBIDSLInput = z.input<typeof zVBIDSL>
export type VBIDSL = z.output<typeof zVBIDSL>
