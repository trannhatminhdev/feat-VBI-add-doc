# 2. DSL 类型速查

类型从 `@visactor/vbi` 导入。

---

## 2.1 VBIChartDSL（根类型）

```ts
interface VBIChartDSL {
  connectorId: string // connector 标识符
  chartType: string // 图表类型：'column' | 'bar' | 'line' | 'pie' | ...
  dimensions: VBIDimension[] // 维度数组
  measures: VBIMeasure[] // 度量数组
  whereFilter: VBIWhereGroup // WHERE 过滤树
  havingFilter: VBIHavingGroup // HAVING 过滤树
  theme: 'light' | 'dark' // 主题
  locale: 'zh-CN' | 'en-US' // 语言
  limit?: number // 行数限制
  version: number
}
```

---

## 2.2 VBIDimension（维度）

```ts
interface VBIDimension {
  id: string
  field: string // 原始字段名
  alias: string // 显示别名
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
    // 日期聚合
    func: 'toYear' | 'toQuarter' | 'toMonth' | 'toWeek' | 'toDay' | 'toHour' | 'toMinute' | 'toSecond'
  }
  sort?: { order: 'asc' | 'desc' }
}
```

---

## 2.3 VBIMeasure（度量）

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
  format?:
    | { autoFormat: true }
    | {
        autoFormat?: false
        prefix?: string
        suffix?: string
        decimalCount?: number
        thousandsSeparator?: boolean
      }
  sort?: { order: 'asc' | 'desc' }
}
```

---

## 2.4 VBIWhereGroup（WHERE 过滤树）

```ts
interface VBIWhereGroup {
  id: string
  op: 'and' | 'or'
  conditions: VBIWhereClause[]
}

type VBIWhereClause = VBIWhereFilter | VBIWhereGroup

interface VBIWhereFilter {
  id: string
  field: string
  op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'not in' | 'date'
  value?: unknown
  // op='date' 时使用日期范围结构
}
```

---

## 2.5 VBIHavingGroup（HAVING 过滤树）

```ts
interface VBIHavingGroup {
  id: string
  op: 'and' | 'or'
  conditions: VBIHavingClause[]
}

type VBIHavingClause = VBIHavingFilter | VBIHavingGroup

interface VBIHavingFilter {
  id: string
  field: string
  aggregate: VBIHavingAggregate // 必须指定聚合函数
  op: '>' | '<' | '>=' | '<=' | '=' | '!='
  value?: unknown
}

// VBIHavingAggregate = { func: string; quantile?: number }
```

---

## 2.6 VBISchemaField（字段元信息）

```ts
interface VBISchemaField {
  name: string // 字段名
  type: string // 'string' | 'number' | 'date' | 'datetime' | 'timestamp' | 'boolean'
  role: 'dimension' | 'measure' // 根据 type 自动推断
  isDate: boolean // 是否为日期类型
}
```

字段角色推断规则（`getFieldRoleBySchemaType`）：

- `number` → `measure`
- `string` → `dimension`
- `date` / `datetime` / `timestamp` → `dimension`

---

## 2.7 类型守卫

从 `@visactor/vbi` 导出的类型守卫（`filter-guards.ts`），用于判断 Where/Having 条件树中的节点类型：

```ts
import { isVBIFilter, isVBIWhereGroup, isVBIHavingFilter } from '@visactor/vbi'

// 判断 Where 条件节点
if (isVBIFilter(item)) {
  // item 是叶子过滤节点 VBIWhereFilter
} else if (isVBIWhereGroup(item)) {
  // item 是嵌套组 VBIWhereGroup
}

// 判断 Having 条件节点
if (isVBIHavingFilter(item)) {
  // 是叶子节点，有 aggregate 属性
}
```

---

## 2.8 支持的图表类型

| 组别     | 类型                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| 表格     | `table`, `pivotTable`                                                                       |
| 比较     | `column`, `columnParallel`, `columnPercent`, `bar`, `barParallel`, `barPercent`, `dualAxis` |
| 趋势     | `line`, `area`, `areaPercent`                                                               |
| 占比     | `pie`, `donut`, `rose`, `roseParallel`, `funnel`                                            |
| 分布     | `scatter`, `heatmap`, `boxPlot`, `histogram`, `radar`                                       |
| 层级     | `treeMap`, `sunburst`, `circlePacking`                                                      |
| 动态排名 | `raceBar`, `raceColumn`, `raceLine`, `raceScatter`, `racePie`, `raceDonut`                  |
