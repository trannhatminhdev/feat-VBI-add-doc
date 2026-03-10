import { z } from 'zod'
import { zVBIDimensionTree } from '../dimensions/dimensions'
import { zVBIMeasureTree } from '../measures/measures'
import { zVBIDSLTheme } from '../theme/theme'
import { zVBIDSLLocale } from '../locale/locale'
import { zVBIWhereClause } from '../whereFilters/filters'
import { zVBIHavingClause } from '../havingFilters/having'

export const zVBIDSL = z.object({
  connectorId: z.string(),
  chartType: z.custom<any>(), // Use any to avoid circular dependency or simplify for now
  dimensions: zVBIDimensionTree,
  measures: zVBIMeasureTree,
  havingFilters: z.array(zVBIHavingClause).optional().default([]),
  whereFilters: z.array(zVBIWhereClause).optional().default([]),
  theme: zVBIDSLTheme,
  locale: zVBIDSLLocale,
  limit: z.number().int().min(1).optional(),
  version: z.number().int().min(0),
})

export type VBIDSL = z.infer<typeof zVBIDSL>
