import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartBuilder } from 'src/chart-builder/builder'
import type { VBIInsightBuilder } from 'src/insight-builder/builder'
import type { VBIReportBuilder } from 'src/report-builder/builder'
import type { VBIReportPageDSL } from 'src/types'

type ResourceReference = string | { getUUID: () => string }

const resolveResourceReference = (value: ResourceReference): string => {
  return typeof value === 'string' ? value : value.getUUID()
}

export class ReportPageBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  constructor(
    private parent: VBIReportBuilder<TQueryDSL, TSeedDSL>,
    private page: Y.Map<any>,
  ) {}

  getId(): string {
    return this.page.get('id')
  }

  get chart(): VBIChartBuilder<TQueryDSL, TSeedDSL> | undefined {
    return this.parent.getChartBuilder(this.page.get('chartId') ?? '')
  }

  get insight(): VBIInsightBuilder | undefined {
    return this.parent.getInsightBuilder(this.page.get('insightId') ?? '')
  }

  setTitle(title: string): this {
    this.page.set('title', title)
    return this
  }

  setChartId(chart: ResourceReference): this {
    this.page.set('chartId', resolveResourceReference(chart))
    return this
  }

  setInsightId(insight: ResourceReference): this {
    this.page.set('insightId', resolveResourceReference(insight))
    return this
  }

  toJSON(): VBIReportPageDSL {
    return this.page.toJSON() as VBIReportPageDSL
  }
}
