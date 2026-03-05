import { z } from 'zod'
import { zVBIDimensionTree } from '../dimensions/dimensions'
import { zVBIMeasureTree } from '../measures/measures'
import { zVBIDSLTheme } from '../theme/theme'
import { zVBIDSLLocale } from '../locale/locale'
import { zVBIFilter } from '../filters/filters'

export const zVBIDSL = z.object({
  connectorId: z.string(),
  chartType: z.custom<any>(), // Use any to avoid circular dependency or simplify for now
  dimensions: zVBIDimensionTree,
  measures: zVBIMeasureTree,
  filters: z.array(zVBIFilter).optional().default([]),
  theme: zVBIDSLTheme,
  locale: zVBIDSLLocale,
  version: z.number().int().min(0),
})

export type VBIDSL = z.infer<typeof zVBIDSL>
