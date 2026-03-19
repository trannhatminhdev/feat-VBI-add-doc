# ADR-002: VBI 日期筛选 DSL 与 Demo UI 方案

## Status

Proposed

## Context

当前 VBI 的 `whereFilter` 只支持通用比较操作，对日期字段缺少稳定的一等语义：

1. 无法直接表达“本月”“上季度”“最近 7 天”这类 BI 常用筛选。
2. 无法稳定表达“2024 年”“2024-Q1”“2024-03”这类自然周期筛选。
3. 旧草案中的 `dateOp`、`dateValue`、`granularity` 是平铺字段，容易产生非法组合，也会把日期语义拆散。

同时，`practices/demo` 当前的 `where` UI 仍然是纯标量表单：

1. [`FilterPanel.tsx`](../../practices/demo/src/components/Filter/FilterPanel.tsx) 只支持通用比较表单、`range`、`tags` 这类输入策略。
2. [`WhereShelf.tsx`](../../practices/demo/src/components/Shelfs/shelves/WhereShelf.tsx) 和 [`useVBIWhereFilter.ts`](../../practices/demo/src/hooks/useVBIWhereFilter.ts) 只知道 `setOperator(...)` / `setValue(...)`。
3. 日期维度虽然已有 `isDate` 标记，但还没有独立的日期筛选编辑器。

底层 `vquery` 已经补齐了当前阶段需要依赖的基础验证：

1. `where` 单元测试已覆盖 date string 的 `=` / `>=` / `<` / `between`。
2. `where` 单元测试已覆盖 timestamp 的 `Date` 输入比较与 `between`。
3. example 测试已覆盖 date `between`、timestamp window、date `where` 与 date aggregate `select` 并存。
4. example 输出已改为格式化日期别名，验证结果不再只显示 epoch 时间戳。

相关验证文件：

- `packages/vquery/tests/unit/sql-builder/builders/where.test.ts`
- `packages/vquery/tests/examples/where/date_between.json`
- `packages/vquery/tests/examples/where/timestamp_window.json`
- `packages/vquery/tests/examples/select/date/toMonth_with_date_filter.json`

## Decision

### 1. 类型命名统一为 `VBIWhereFilter` / `zVBIWhereFilter`

`whereFilter` 模块内的过滤节点类型统一改名：

- `VBIFilter` -> `VBIWhereFilter`
- `zVBIFilter` -> `zVBIWhereFilter`

对应的联合类型也统一为：

- `VBIWhereClause = VBIWhereFilter | VBIWhereGroup`
- `zVBIWhereClause = z.union([zVBIWhereFilter, zVBIWhereGroup])`

这里的重点不是单纯重命名，而是把 `whereFilter` 体系内的命名收敛到同一风格，避免一个模块同时出现 `VBIWhereGroup` 和 `VBIFilter` 这种不对称命名。

### 2. 日期筛选统一使用 `op: 'date' + DatePredicate`

不再引入 `dateOp` / `dateValue` / `granularity` 这类平铺字段。

```typescript
type DateInput = string | Date
type DateUnit = 'year' | 'quarter' | 'month' | 'week' | 'day'
type DateBounds = '[)' | '[]'

type DatePeriod =
  | { unit: 'year'; year: number }
  | { unit: 'quarter'; year: number; quarter: 1 | 2 | 3 | 4 }
  | { unit: 'month'; year: number; month: number }
  | { unit: 'week'; year: number; week: number }
  | { unit: 'day'; date: DateInput }

type DatePredicate =
  | {
      type: 'range'
      start: DateInput
      end: DateInput
      bounds?: DateBounds
    }
  | {
      type: 'relative'
      mode: 'last' | 'next'
      amount: number
      unit: DateUnit
      complete?: boolean
    }
  | {
      type: 'current'
      unit: DateUnit
      offset?: number
    }
  | ({
      type: 'period'
    } & DatePeriod)

type VBIWhereScalarFilter = {
  id: string
  field: string
  op: string
  value?: unknown
}

type VBIWhereDateFilter = {
  id: string
  field: string
  op: 'date'
  value: DatePredicate
}

type VBIWhereFilter = VBIWhereScalarFilter | VBIWhereDateFilter
```

这个结构只保留一个日期入口，所有日期语义都收敛进 `DatePredicate`，不再把自然周期、滚动区间、绝对范围拆成多个顶层字段组合。

### 3. `DatePredicate.type` 固定为 `range | relative | current | period`

四类语义分别承担明确职责：

- `range`: 显式的绝对时间范围。
- `relative`: 相对当前时间的滚动窗口。
- `current`: 当前自然周期及其偏移周期。
- `period`: 指定的自然周期。

示例：

```typescript
{
  field: 'order_date',
  op: 'date',
  value: {
    type: 'range',
    start: '2024-01-01',
    end: '2024-02-01',
    bounds: '[)'
  }
}

{
  field: 'order_date',
  op: 'date',
  value: {
    type: 'relative',
    mode: 'last',
    amount: 7,
    unit: 'day'
  }
}

{
  field: 'order_date',
  op: 'date',
  value: {
    type: 'current',
    unit: 'month'
  }
}

{
  field: 'order_date',
  op: 'date',
  value: {
    type: 'period',
    unit: 'quarter',
    year: 2024,
    quarter: 1
  }
}
```

### 4. Builder API 只新增 `WhereFilterNodeBuilder.setDate(...)`

`WhereFilterBuilder` 保持现有 `add(field, callback)` 形态，不新增：

- `addDate`
- `addDateRange`
- `addCurrentDate`
- `addRelativeDate`
- `addDatePeriod`

新增入口只放在 `WhereFilterNodeBuilder`：

```typescript
class WhereFilterNodeBuilder {
  setOperator(operator: string): this
  setValue(value: unknown): this
  setDate(predicate: DatePredicate): this
}
```

调用方式：

```typescript
builder.whereFilter.add('order_date', (node) => {
  node.setDate({ type: 'current', unit: 'month' })
})
```

这个约束的目的很明确：DSL 的复杂度只保留在 `DatePredicate`，不把同一套复杂度复制成一串 builder sugar。

### 5. Lowering 只面向已验证的 `vquery` where 原子能力

日期筛选在 VBI 的 `buildWhere` 阶段解析，最终只下沉到当前已经验证过的 `vquery` where 原子条件：

- `=`
- `>`
- `>=`
- `<`
- `<=`
- `between`
- `and`
- `or`

约束如下：

1. `vquery` 不感知 `relative` / `current` / `period` 这类业务语义。
2. VBI 负责把日期语义解析成普通 where 条件。
3. `range` 可以直接 lowering 为范围比较或 `between`。
4. `relative` / `current` / `period` 的边界解析必须先在 VBI 中完成，再进入 `vquery`。

这里有一条额外约束必须写清楚：ADR 不把任何尚未被测试证明的边界公式当作既定事实。像 `period(year: 2024)` 最终如何展开，属于 VBI 实现责任，必须由专门测试锁定之后才算行为成立，不能靠文档拍定。

### 6. 时间解析依赖执行上下文

日期语义解析至少依赖：

1. `now`
2. timezone
3. week rule

当前 ADR 固定以下原则：

1. `week` 按 ISO-8601 处理。
2. `current` / `relative` / `period` 都必须在同一套时间上下文里解析。
3. 任何跨日、跨周、跨月、跨季度、跨年的边界行为，都必须由测试覆盖后才可视为稳定语义。

### 7. 运行时 Schema 使用判别联合，并统一命名

```typescript
const zDatePredicate = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('range'),
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]),
    bounds: z.enum(['[)', '[]']).optional(),
  }),
  z.object({
    type: z.literal('relative'),
    mode: z.enum(['last', 'next']),
    amount: z.number().int().positive(),
    unit: z.enum(['year', 'quarter', 'month', 'week', 'day']),
    complete: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('current'),
    unit: z.enum(['year', 'quarter', 'month', 'week', 'day']),
    offset: z.number().int().optional(),
  }),
  z.object({
    type: z.literal('period'),
    unit: z.literal('year'),
    year: z.number().int(),
  }),
  z.object({
    type: z.literal('period'),
    unit: z.literal('quarter'),
    year: z.number().int(),
    quarter: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  }),
  z.object({
    type: z.literal('period'),
    unit: z.literal('month'),
    year: z.number().int(),
    month: z.number().int().min(1).max(12),
  }),
  z.object({
    type: z.literal('period'),
    unit: z.literal('week'),
    year: z.number().int(),
    week: z.number().int().min(1).max(53),
  }),
  z.object({
    type: z.literal('period'),
    unit: z.literal('day'),
    date: z.union([z.string(), z.date()]),
  }),
])

const zVBIWhereDateFilter = z.object({
  id: z.string(),
  field: z.string(),
  op: z.literal('date'),
  value: zDatePredicate,
})

const zVBIWhereScalarFilter = z.object({
  id: z.string(),
  field: z.string(),
  op: z.string().refine((op) => op !== 'date'),
  value: z.any().optional(),
})

export const zVBIWhereFilter = z.union([zVBIWhereDateFilter, zVBIWhereScalarFilter])
```

### 8. `practices/demo` UI 采用“同一入口、日期分流”的编辑方案

UI 目标不是在现有标量表单里硬塞更多字段，而是在同一个 `where` 编辑入口里，对日期字段切换到独立的日期编辑模式。

#### UI 原则

1. `WhereShelf` 仍然只有一个编辑入口，不拆出第二套独立 shelf。
2. 非日期字段继续使用现有标量 `op + value` 表单。
3. 日期字段一旦进入编辑态，表单直接切换为 `DatePredicate` 编辑器，不再复用标量操作符下拉。
4. 不把 `range` / `relative` / `current` / `period` 的所有输入项同时摊平展示，先选 `type`，再展示对应子表单。

#### 建议的表单模型

`practices/demo` 内部可以继续复用现有 `FilterItem` 外形，但在类型上要把日期分支单独表达出来：

```typescript
type DemoWhereScalarFilterItem = {
  id?: string
  field: string
  op: Exclude<string, 'date'>
  value?: unknown
}

type DemoWhereDateFilterItem = {
  id?: string
  field: string
  op: 'date'
  value: DatePredicate
}

type DemoWhereFilterItem = DemoWhereScalarFilterItem | DemoWhereDateFilterItem
```

也就是说，demo 不需要额外发明第二套持久化 DSL，只需要在 UI 层把 `op: 'date'` 作为明确的日期编辑分支。

#### 日期子表单结构

- `range`
  - 输入项：`start`、`end`、`bounds`
  - 组件建议：`DatePicker` / `RangePicker` + 边界开关
- `relative`
  - 输入项：`mode`、`amount`、`unit`、`complete`
  - 组件建议：`Select` + `InputNumber` + `Switch`
- `current`
  - 输入项：`unit`、`offset`
  - 组件建议：`Select` + `InputNumber`
- `period`
  - 先选 `unit`
  - 再按 `unit` 渲染动态字段：
    - `year`: `year`
    - `quarter`: `year` + `quarter`
    - `month`: `year` + `month`
    - `week`: `year` + `week`
    - `day`: `date`

#### 组件改造点

- [`practices/demo/src/components/Filter/FilterPanel.tsx`](../../practices/demo/src/components/Filter/FilterPanel.tsx)
  - 根据 `field.isDate` 分流为标量编辑器或日期编辑器。
  - 日期编辑器使用 `type` 选择器驱动动态子表单。
  - 提交时，如果是日期模式，输出 `{ op: 'date', value: DatePredicate }`。

- [`practices/demo/src/components/Filter/whereFilterUtils.ts`](../../practices/demo/src/components/Filter/whereFilterUtils.ts)
  - 保留现有标量 operator/input strategy 工具函数。
  - 新增日期表单的默认值、序列化、反序列化、展示文案生成工具。
  - `getWhereDisplayText(...)` 需要支持 `op === 'date'` 的可读展示。

- [`practices/demo/src/components/Shelfs/shelves/WhereShelf.tsx`](../../practices/demo/src/components/Shelfs/shelves/WhereShelf.tsx)
  - 新增 `item.op === 'date'` 分支。
  - add/update 时，日期节点改用 `node.setDate(...)`，非日期节点继续用 `setOperator(...)` / `setValue(...)`。

- [`practices/demo/src/hooks/useVBIWhereFilter.ts`](../../practices/demo/src/hooks/useVBIWhereFilter.ts)
  - mutator typing 增加 `setDate(...)`。
  - `VBIWhereFilter` 命名同步替代旧的 `VBIFilter`。

#### i18n 要求

需要在中英文 locale 中新增：

- 日期类型名称：`range` / `relative` / `current` / `period`
- 日期单位名称：`year` / `quarter` / `month` / `week` / `day`
- `last` / `next` / `complete`
- `bounds`
- `quarter`、`week`、`offset` 等字段标签

#### UI 测试要求

`practices/demo` 至少需要补：

1. 日期 filter 从 builder 值回填到表单的测试。
2. 日期表单序列化为 `{ op: 'date', value: DatePredicate }` 的测试。
3. `range` / `relative` / `current` / `period` 四种模式的展示文案测试。
4. 日期字段和非日期字段切换时，表单状态正确重置的测试。

### 9. 合入前测试要求

#### 已完成的基础验证

- `packages/vquery/tests/unit/sql-builder/builders/where.test.ts`
- `packages/vquery/tests/examples/where/date_between.test.ts`
- `packages/vquery/tests/examples/where/timestamp_window.test.ts`
- `packages/vquery/tests/examples/select/date/toMonth_with_date_filter.test.ts`

这些验证说明当前 `vquery` 已经可以承接日期筛选最终 lowering 后所需的基础 where 能力。

#### VBI 必补测试

在 VBI 日期 DSL 合入前，必须新增并通过：

1. `VBIWhereFilter` / `zVBIWhereFilter` 的 schema 与序列化测试。
2. `WhereFilterNodeBuilder.setDate(...)` 的 builder 测试。
3. `buildWhere` 针对 `range` / `relative` / `current` / `period` 的 lowering 测试。
4. timezone、ISO week、边界开闭规则的解析测试。

#### Demo 必补测试

在 `practices/demo` UI 合入前，必须新增并通过：

1. `whereFilterUtils` 的日期序列化与展示文案测试。
2. `FilterPanel` 的日期编辑模式测试。
3. `WhereShelf` 的日期 add/update 测试。

## Consequences

### Positive

1. `whereFilter` 的类型命名与模块风格统一。
2. 日期筛选 DSL 收敛为一个稳定入口，不再有平铺字段拼装。
3. builder API 保持克制，复杂度集中在 `DatePredicate`。
4. `practices/demo` 能在不复制 DSL 的前提下，支持四类日期筛选器。
5. lowering 目标完全依赖已验证的 `vquery` 基础能力。

### Negative

1. VBI 需要承担日期语义解析和时间上下文管理职责。
2. `practices/demo` 的表单状态会从单一路径变成标量模式和日期模式两条路径。
3. 日期边界行为如果没有测试锁定，风险会直接体现在 query 结果上。

## Implementation Impact

- `packages/vbi/src/types/dsl/whereFilter/filters.ts`
- `packages/vbi/src/types/dsl/index.ts`
- `packages/vbi/src/index.ts`
- `packages/vbi/src/builder/features/whereFilter/where-node-builder.ts`
- `packages/vbi/src/pipeline/vqueryDSL/buildWhere.ts`
- `packages/vbi/tests/builder/features/whereFilter.test.ts`
- `practices/demo/src/components/Filter/FilterPanel.tsx`
- `practices/demo/src/components/Filter/whereFilterUtils.ts`
- `practices/demo/src/components/Shelfs/shelves/WhereShelf.tsx`
- `practices/demo/src/hooks/useVBIWhereFilter.ts`
- `practices/demo/src/i18n/locales/zh-CN.json`
- `practices/demo/src/i18n/locales/en-US.json`
- `practices/demo/tests/whereFilterUtils.test.ts`

## Reference

- VBI WhereFilter Types: `packages/vbi/src/types/dsl/whereFilter/filters.ts`
- VBI WhereFilter Node Builder: `packages/vbi/src/builder/features/whereFilter/where-node-builder.ts`
- VBI buildWhere: `packages/vbi/src/pipeline/vqueryDSL/buildWhere.ts`
- Demo Filter Panel: `practices/demo/src/components/Filter/FilterPanel.tsx`
- Demo Where Utils: `practices/demo/src/components/Filter/whereFilterUtils.ts`
- Demo Where Shelf: `practices/demo/src/components/Shelfs/shelves/WhereShelf.tsx`
- Demo Where Hook: `practices/demo/src/hooks/useVBIWhereFilter.ts`
- VQuery Where Tests: `packages/vquery/tests/unit/sql-builder/builders/where.test.ts`

## 淘汰内容简述

以下做法已明确淘汰：

1. `dateOp` + `dateValue` + `granularity` 的平铺建模。
2. `WhereFilterBuilder.addDate*` 一类便捷方法堆叠。
3. 把所有日期类型塞回现有标量 `op + value` 表单。
4. 在没有测试的前提下，直接把某种日期语义的边界展开当成既定事实写死。
