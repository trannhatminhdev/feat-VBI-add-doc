export type VQueryBaseAggregateFunc =
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

export type VQueryDateAggregateFunc =
  | 'to_year'
  | 'to_quarter'
  | 'to_month'
  | 'to_week'
  | 'to_day'
  | 'to_hour'
  | 'to_minute'
  | 'to_second'

export type VQueryAggregateFunc = VQueryBaseAggregateFunc | VQueryDateAggregateFunc

export type VQueryAggregate = {
  func: VQueryAggregateFunc
  quantile?: number
}

export type VBIMeasureAggregateInput =
  | { func: 'count' }
  | { func: 'countDistinct' }
  | { func: 'sum' }
  | { func: 'avg' }
  | { func: 'min' }
  | { func: 'max' }
  | { func: 'variance' }
  | { func: 'variancePop' }
  | { func: 'stddev' }
  | { func: 'median' }
  | { func: 'quantile'; quantile?: number }

export type VBIDimensionAggregateInput =
  | { func: 'toYear' }
  | { func: 'toQuarter' }
  | { func: 'toMonth' }
  | { func: 'toWeek' }
  | { func: 'toDay' }
  | { func: 'toHour' }
  | { func: 'toMinute' }
  | { func: 'toSecond' }

const VBI_TO_VQUERY_MEASURE_AGGR_FUNC_MAP: Record<VBIMeasureAggregateInput['func'], VQueryBaseAggregateFunc> = {
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

const VBI_TO_VQUERY_DIMENSION_AGGR_FUNC_MAP: Record<VBIDimensionAggregateInput['func'], VQueryDateAggregateFunc> = {
  toYear: 'to_year',
  toQuarter: 'to_quarter',
  toMonth: 'to_month',
  toWeek: 'to_week',
  toDay: 'to_day',
  toHour: 'to_hour',
  toMinute: 'to_minute',
  toSecond: 'to_second',
}

export const mapAggregateForVQuery = (aggregate: VBIMeasureAggregateInput | undefined): VQueryAggregate | undefined => {
  if (!aggregate) {
    return aggregate
  }
  const mappedFunc = VBI_TO_VQUERY_MEASURE_AGGR_FUNC_MAP[aggregate.func] ?? aggregate.func
  return { ...aggregate, func: mappedFunc } as VQueryAggregate
}

export const mapDimensionAggregateForVQuery = (
  aggregate: VBIDimensionAggregateInput | undefined,
): VQueryAggregate | undefined => {
  if (!aggregate) {
    return aggregate
  }
  const mappedFunc = VBI_TO_VQUERY_DIMENSION_AGGR_FUNC_MAP[aggregate.func] ?? aggregate.func
  return { ...aggregate, func: mappedFunc } as VQueryAggregate
}
