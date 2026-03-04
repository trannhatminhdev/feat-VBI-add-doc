/**
 * Having 子句类型定义
 * 用于聚合后的数据筛选
 */

export type Having<T> = HavingGroup<T>

export type HavingGroup<T> = {
  op: 'and' | 'or'
  conditions: Array<HavingClause<T>>
}

export type HavingClause<T> = HavingLeaf<T> | HavingGroup<T>

/**
 * Having 叶子节点
 * 支持聚合函数操作符
 */
export type HavingLeaf<T> = {
  [K in keyof T]: {
    [O in HavingOperator]: {
      field: K
      op: O
    } & (O extends 'is null' | 'is not null'
      ? { value?: never }
      : O extends 'in' | 'not in'
        ? { value: T[K] | T[K][] }
        : O extends 'between' | 'not between'
          ? { value: [T[K], T[K]] }
          : { value: T[K] })
  }[HavingOperator]
}[keyof T]

/**
 * Having 操作符
 * 聚合函数操作符
 */
export type HavingOperator =
  // 聚合函数操作符
  | 'sum'
  | 'avg'
  | 'count'
  | 'min'
  | 'max'
  // 比较操作符
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
  // 存在性检查
  | 'is null'
  | 'is not null'
