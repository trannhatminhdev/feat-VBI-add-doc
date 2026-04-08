import { z } from 'zod'
import { zVBIChartDSL } from '../chartDSL/vbi/vbi'
import { zVBIInsightDSL } from '../insightDSL/insight'
import { zVBIReportDSL } from './report'

export const zVBIReportSnapshotDSL = z.object({
  report: zVBIReportDSL,
  charts: z.record(z.string(), zVBIChartDSL),
  insights: z.record(z.string(), zVBIInsightDSL),
})

export type VBIReportSnapshotDSLInput = z.input<typeof zVBIReportSnapshotDSL>
export type VBIReportSnapshotDSL = z.output<typeof zVBIReportSnapshotDSL>
