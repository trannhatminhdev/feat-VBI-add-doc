export type BaseAggregateFunction =
  | 'count'
  | 'count_distinct'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'variance'
  | 'stddev'
  | 'median'
  | 'quantile'

export type DateAggregateFunction =
  | 'to_year'
  | 'to_quarter'
  | 'to_month'
  | 'to_week'
  | 'to_day'
  | 'to_hour'
  | 'to_minute'
  | 'to_second'

export type AggregateFunction = BaseAggregateFunction | DateAggregateFunction

export type SelectItem<T> = {
  field: keyof T
  alias?: string
  func?: AggregateFunction
}

export type Select<T> = Array<keyof T | SelectItem<T>>
