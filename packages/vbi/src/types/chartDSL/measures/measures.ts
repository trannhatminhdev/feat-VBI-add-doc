import { z } from 'zod'
import type { NumFormat } from '@visactor/vseed'
import { zNumFormat } from '@visactor/vseed'
import { zAggregate } from './aggregate'
import { zVBISort } from '../sort'

const zNumFormatObject = zNumFormat.unwrap()

export const zVBIMeasureFormat = z.union([
  z.object({ autoFormat: z.literal(true) }),
  zNumFormatObject.extend({ autoFormat: z.literal(false).optional() }),
])

export type VBIMeasureFormat = { autoFormat: true } | ({ autoFormat?: false } & NumFormat)

export const zVBIMeasure = z.object({
  id: z.string(),
  field: z.string(),
  alias: z.string(),
  encoding: z.enum([
    'primaryYAxis',
    'secondaryYAxis',
    'xAxis',
    'yAxis',
    'angle',
    'radius',
    'size',
    'color',
    'detail',
    'column',
    'label',
    'tooltip',
    'value',
    'q1',
    'q3',
    'min',
    'max',
    'median',
    'outliers',
    'x0',
    'x1',
  ]),
  aggregate: zAggregate,
  format: zVBIMeasureFormat.optional(),
  sort: zVBISort.optional(),
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
