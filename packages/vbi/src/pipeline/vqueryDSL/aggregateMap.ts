export type VQueryAggregateFunc =
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

export type VQueryAggregate = {
  func: VQueryAggregateFunc
  quantile?: number
}

export type VBIAggregateInput =
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

const VBI_TO_VQUERY_AGGR_FUNC_MAP: Record<VBIAggregateInput['func'], VQueryAggregateFunc> = {
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

export const mapAggregateForVQuery = (aggregate: VBIAggregateInput | undefined): VQueryAggregate | undefined => {
  if (!aggregate) {
    return aggregate
  }
  const mappedFunc = VBI_TO_VQUERY_AGGR_FUNC_MAP[aggregate.func] ?? aggregate.func
  return { ...aggregate, func: mappedFunc } as VQueryAggregate
}
