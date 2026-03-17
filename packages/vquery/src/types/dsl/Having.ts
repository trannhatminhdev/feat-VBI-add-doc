/**
 * Having 子句类型定义
 * 用于聚合后的数据筛选
 */
import type { BaseAggregateFunction } from './Select'

export type Having<T> = HavingGroup<T>

export type HavingGroup<T> = {
  op: 'and' | 'or'
  conditions: Array<HavingClause<T>>
}

export type HavingClause<T> = HavingLeaf<T> | HavingGroup<T>

/**
 * Having 叶子节点
 * 通过 aggr 指定聚合方式，通过 op 指定比较操作符
 */
export type HavingLeaf<T> = {
  [K in keyof T]: {
    [O in HavingComparisonOperator]: {
      field: K
      op: O
      aggr: HavingAggregation
    } & (O extends 'is null' | 'is not null'
      ? { value?: never }
      : O extends 'in' | 'not in'
        ? { value: T[K] | T[K][] }
        : O extends 'between' | 'not between'
          ? { value: [T[K], T[K]] }
          : { value: T[K] })
  }[HavingComparisonOperator]
}[keyof T]

/**
 * Having 聚合函数
 */
export type HavingAggregateFunction = BaseAggregateFunction

export type HavingAggregation = {
  func: HavingAggregateFunction
  quantile?: number
}

/**
 * Having 比较操作符
 */
export type HavingComparisonOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  // 范围操作符
  | 'between'
  | 'not between'
  | 'in'
  | 'not in'
  | 'is null'
  | 'is not null'

/**
 * Having 操作符（仅比较操作符）
 */
export type HavingOperator = HavingComparisonOperator
