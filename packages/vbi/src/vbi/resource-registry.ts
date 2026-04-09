import type { VBIChartBuilder } from 'src/chart-builder/builder'
import type { VBIInsightBuilder } from 'src/insight-builder/builder'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartDSL, VBIInsightDSL } from 'src/types'
import type { VBIChartBuilderOptions } from 'src/types'
import { createChartBuilderFromVBIChartDSLInput } from './from/from-vbi-dsl-input'
import { createInsightBuilderFromVBIInsightDSLInput } from './from/from-vbi-insight-dsl-input'

type Buildable<T> = { build: () => T }
type ChartResource = VBIChartBuilder<any, any> | VBIChartDSL
type InsightResource = VBIInsightBuilder | VBIInsightDSL

export interface VBIResourceRegistry {
  charts: Map<string, ChartResource>
  insights: Map<string, InsightResource>
}

export const createVBIResourceRegistry = (): VBIResourceRegistry => ({
  charts: new Map(),
  insights: new Map(),
})

const isBuildable = <T>(value: Buildable<T> | T): value is Buildable<T> => {
  return typeof value === 'object' && value !== null && typeof (value as Buildable<T>).build === 'function'
}

const buildResource = <T>(value: Buildable<T> | T): T => (isBuildable(value) ? value.build() : value)

export const buildChartResource = (resource: ChartResource) => buildResource(resource)

export const buildInsightResource = (resource: InsightResource) => buildResource(resource)

const isChartBuilder = (value: ChartResource): value is VBIChartBuilder<any, any> => {
  return typeof value === 'object' && value !== null && 'buildVQuery' in value
}

const isInsightBuilder = (value: InsightResource): value is VBIInsightBuilder => {
  return typeof value === 'object' && value !== null && 'setContent' in value
}

export const resolveChartBuilder = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  registry: VBIResourceRegistry,
  chartId: string,
  options?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const resource = registry.charts.get(chartId)
  if (!resource) {
    return undefined
  }
  if (isChartBuilder(resource)) {
    return resource as VBIChartBuilder<TQueryDSL, TSeedDSL>
  }

  const builder = createChartBuilderFromVBIChartDSLInput<TQueryDSL, TSeedDSL>(resource, options)
  registry.charts.set(chartId, builder)
  return builder
}

export const resolveInsightBuilder = (registry: VBIResourceRegistry, insightId: string) => {
  const resource = registry.insights.get(insightId)
  if (!resource) {
    return undefined
  }
  if (isInsightBuilder(resource)) {
    return resource
  }

  const builder = createInsightBuilderFromVBIInsightDSLInput(resource)
  registry.insights.set(insightId, builder)
  return builder
}
