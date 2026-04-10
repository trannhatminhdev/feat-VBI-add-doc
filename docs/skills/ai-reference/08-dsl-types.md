# 8. DSL 类型速查

## 8.1 VBIChartDSL（根类型）

```ts
interface VBIChartDSL {
  connectorId: string // connector 标识符
  chartType: string // 图表类型
  dimensions: VBIDimension[] // 维度数组
  measures: VBIMeasure[] // 度量数组
  whereFilter: VBIWhereGroup // WHERE 过滤树
  havingFilter: VBIHavingGroup // HAVING 过滤树
  theme: string // 'light' | 'dark'
  locale: string // 'zh-CN' | 'en-US'
  limit?: number // 行数限制
  version: number // 版本号
}
```

## 8.2 VBIDimension（维度）

```ts
interface VBIDimension {
  id: string
  field: string
  alias: string
  encoding?:
    | 'xAxis'
    | 'yAxis'
    | 'angle'
    | 'color'
    | 'detail'
    | 'tooltip'
    | 'label'
    | 'row'
    | 'column'
    | 'player'
    | 'hierarchy'
  aggregate?: {
    func: 'toYear' | 'toQuarter' | 'toMonth' | 'toWeek' | 'toDay' | 'toHour' | 'toMinute' | 'toSecond'
  }
  sort?: { order: 'asc' | 'desc' }
}
```

## 8.3 VBIMeasure（度量）

```ts
interface VBIMeasure {
  id: string
  field: string
  alias: string
  encoding?:
    | 'yAxis'
    | 'xAxis'
    | 'primaryYAxis'
    | 'secondaryYAxis'
    | 'angle'
    | 'radius'
    | 'size'
    | 'color'
    | 'detail'
    | 'column'
    | 'label'
    | 'tooltip'
    | 'value'
    | 'q1'
    | 'q3'
    | 'min'
    | 'max'
    | 'median'
    | 'outliers'
    | 'x0'
    | 'x1'
  aggregate?: {
    func:
      | 'count'
      | 'countDistinct'
      | 'sum'
      | 'avg'
      | 'min'
      | 'max'
      | 'variance'
      | 'variancePop'
      | 'stddev'
      | 'median'
      | 'quantile'
    quantile?: number // 仅 func='quantile' 时有效，范围 0~1
  }
  format?: { autoFormat: true } | ({ autoFormat?: false } & NumFormat)
  sort?: { order: 'asc' | 'desc' }
}
```

## 8.4 VBIWhereGroup（WHERE 过滤树）

```ts
interface VBIWhereGroup {
  id: string
  op: 'and' | 'or'
  conditions: VBIWhereClause[] // VBIWhereFilter | VBIWhereGroup 的数组
}

type VBIWhereClause = VBIWhereFilter | VBIWhereGroup

interface VBIWhereFilter {
  id: string
  field: string
  op: string // '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'not in' | 'date'
  value?: unknown
  // 当 op='date' 时，使用下面的 value 结构
  // value?: VBIWhereDatePredicate
}
```

## 8.5 VBIHavingGroup（HAVING 过滤树）

```ts
interface VBIHavingGroup {
  id: string
  op: 'and' | 'or'
  conditions: VBIHavingClause[] // VBIHavingFilter | VBIHavingGroup 的数组
}

type VBIHavingClause = VBIHavingFilter | VBIHavingGroup

interface VBIHavingFilter {
  id: string
  field: string
  aggregate: VBIAggregate // 必须指定聚合函数
  op: string // '>' | '<' | '>=' | '<=' | '=' | '!='
  value?: unknown
}
```
