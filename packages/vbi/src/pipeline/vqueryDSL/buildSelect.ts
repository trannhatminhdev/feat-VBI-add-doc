import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { MeasuresBuilder, DimensionsBuilder } from '../../builder'
import type { VBIMeasure } from '../../types'

type VQueryAggregateFunc =
  | 'count'
  | 'count_distinct'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'variance'
  | 'variance_pop'
  | 'stddev'
  | 'median'
  | 'quantile'

type VQueryAggregate = {
  func: VQueryAggregateFunc
  quantile?: number
}

const VBI_TO_VQUERY_AGGR_FUNC_MAP: Record<VBIMeasure['aggregate']['func'], VQueryAggregateFunc> = {
  count: 'count',
  countDistinct: 'count_distinct',
  sum: 'sum',
  avg: 'avg',
  min: 'min',
  max: 'max',
  variance: 'variance',
  variancePop: 'variance_pop',
  stddev: 'stddev',
  median: 'median',
  quantile: 'quantile',
}

const mapAggregateForVQuery = (aggregate: VBIMeasure['aggregate'] | undefined): VQueryAggregate | undefined => {
  if (!aggregate) {
    return aggregate
  }
  const mappedFunc = VBI_TO_VQUERY_AGGR_FUNC_MAP[aggregate.func] ?? aggregate.func
  return { ...aggregate, func: mappedFunc } as VQueryAggregate
}

export const buildSelect: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const measures = vbiDSL.measures
  const dimensions = vbiDSL.dimensions

  const result = { ...queryDSL }
  const measureNodes = measures.filter((measure) => MeasuresBuilder.isMeasureNode(measure))
  const measureSelects = measureNodes.map((measure) => ({
    field: measure.field,
    alias: measure.alias,
    aggr: mapAggregateForVQuery(measure.aggregate),
  }))

  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
  const dimensionSelects = dimensionNodes.map((dimension) => ({
    field: dimension.field,
    alias: dimension.alias,
  }))

  result.select = [...measureSelects, ...dimensionSelects] as any

  return result as VQueryDSL
}
