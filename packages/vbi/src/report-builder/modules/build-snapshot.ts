import type { VBIReportDSL, VBIReportSnapshotDSL } from 'src/types'
import type { VBIResourceRegistry } from 'src/vbi/resource-registry'
import { buildChartResource, buildInsightResource } from 'src/vbi/resource-registry'

export const buildVBIReportSnapshotDSL = (
  report: VBIReportDSL,
  resourceRegistry: VBIResourceRegistry,
): VBIReportSnapshotDSL => {
  const charts: VBIReportSnapshotDSL['charts'] = {}
  const insights: VBIReportSnapshotDSL['insights'] = {}

  for (const page of report.pages) {
    const chart = resourceRegistry.charts.get(page.chartId)
    if (!chart) {
      throw new Error(`Missing chart resource "${page.chartId}"`)
    }
    const insight = resourceRegistry.insights.get(page.insightId)
    if (!insight) {
      throw new Error(`Missing insight resource "${page.insightId}"`)
    }
    charts[page.chartId] = buildChartResource(chart)
    insights[page.insightId] = buildInsightResource(insight)
  }

  return { report, charts, insights }
}
