import { z } from 'zod'
import { zVBIChartDSL } from '../chartDSL/vbi/vbi'
import { zVBIReportTextDSL } from './text'

export const zVBIReportPageDSL = z.object({
  id: z.string(),
  title: z.string(),
  chart: zVBIChartDSL,
  text: zVBIReportTextDSL.optional().default({ content: '' }),
})

export type VBIReportPageDSLInput = z.input<typeof zVBIReportPageDSL>
export type VBIReportPageDSL = z.output<typeof zVBIReportPageDSL>
