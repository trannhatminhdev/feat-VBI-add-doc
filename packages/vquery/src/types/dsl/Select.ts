export type AggregateFunction =
  | 'count'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'quantile'
  | 'to_year'
  | 'to_quarter'
  | 'to_month'
  | 'to_week'
  | 'to_day'
  | 'to_hour'
  | 'to_minute'
  | 'to_second'

export type SelectItem<T> = {
  field: keyof T
  alias?: string
  func?: AggregateFunction
}

export type Select<T> = Array<keyof T | SelectItem<T>>
