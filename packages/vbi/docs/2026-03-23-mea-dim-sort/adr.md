# ADR-004: VBI Measure / Dimension 排序 DSL 与 buildVQuery Lowering

## Context

`@visactor/vquery` 已支持 `orderBy?: Array<{ field: string; order?: 'asc' | 'desc' }>`，但当前 VBI 的 `buildVQuery()` 只构建了 `select`、`groupBy`、`where`、`having`、`limit`，还没有一等排序能力。

同时，`VBIDimension` 和 `VBIMeasure` 也还没有排序 DSL。这会带来三个直接问题：

1. 用户无法在 VBI 层显式表达“按某个维度升序”或“按某个指标降序”。
2. `buildVQuery()` 无法为分组结果提供稳定默认顺序，查询结果顺序不可预期。
3. 如果单独在根 DSL 再引入一套 `orderBy`，会和 measure / dimension 节点形成双写，不符合 Single Source of Truth。

本 ADR 要解决的范围仅限 `packages/vbi`：

1. measure 和 dimension 都支持排序配置。
2. 如果没有任何显式排序，`buildVQuery()` 默认按第一个 dimension 升序。
3. 如果任一 measure 或 dimension 配置了排序，则完全按显式配置输出，忽略默认逻辑。

## Decision

### 1. 排序配置挂在 measure / dimension 节点本身

VBI 新增共享排序类型：

```typescript
type VBISortOrder = 'asc' | 'desc'
type VBISort = { order: VBISortOrder }
```

并分别扩展：

```typescript
type VBIDimension = {
  id: string
  field: string
  alias: string
  sort?: VBISort
}

type VBIMeasure = {
  id: string
  field: string
  alias: string
  sort?: VBISort
}
```

不新增根级 `vbiDSL.orderBy`。排序语义属于字段节点本身，应随节点一起被创建、更新、删除和重排。

### 2. NodeBuilder 只新增 `get/set/clearSort`

`DimensionNodeBuilder` 和 `MeasureNodeBuilder` 都新增：

```typescript
setSort(sort: VBISort): this
getSort(): VBISort | undefined
clearSort(): this
```

不新增 `sortAsc()`、`sortDesc()` 之类语法糖。Builder API 直接复用 DSL 结构，降低心智负担，也给后续扩展保留空间。

### 3. `buildVQuery()` 新增独立 `buildOrderBy` pipe

VBI 新增 `packages/vbi/src/pipeline/vqueryDSL/buildOrderBy.ts`，并接入主流水线：

```typescript
select -> groupBy -> where -> having -> orderBy -> limit
```

`buildOrderBy` 的规则固定如下：

1. 先收集已配置 `sort` 的 dimension，保持 `dimensions` 数组中的当前顺序。
2. 再收集已配置 `sort` 的 measure，保持 `measures` 数组中的当前顺序。
3. 如果显式排序列表非空，则直接生成 `queryDSL.orderBy`，忽略默认排序。
4. 如果显式排序列表为空且存在第一个 dimension，则生成 `[{ field: firstDimension.id, order: 'asc' }]`。
5. 如果既没有显式排序，也没有 dimension，则不写入 `orderBy`。

当前阶段显式排序的总顺序定义为“dimension 在前，measure 在后”。这是一个确定性规则，也和“默认按第一个 dimension 排序”的回退逻辑保持一致。

### 4. `orderBy.field` 统一使用节点 `id`

VBI 输出到 VQuery 的排序字段统一使用节点 `id`，而不是源字段名：

```typescript
{ field: node.id, order: node.sort.order }
```

原因：

1. `buildSelect()` 已经把每个 measure / dimension 都 alias 成自己的 `id`。
2. measure 通常带聚合，直接按原始 `field` 排序不稳定，也可能不合法。
3. date dimension 这类带 `aggregate` 的维度，本质上排序目标也是派生后的 select alias，而不是原始列。

统一按 `id` 排序，可以避免在 `buildOrderBy` 中重复判断 measure / dimension / aggregate 分支。

### 5. 默认排序只体现在 `buildVQuery()`，不回写 DSL

“默认按第一个 dimension 升序”只是 query lowering 期的回退规则，不写回 `VBIChartDSL`，也不在 builder 的 JSON 输出里补默认 `sort`。

这意味着：

1. `builder.build()` 的 DSL 结构保持最小表达。
2. `builder.buildVQuery()` 结果会因为新增默认排序而发生快照变化。
3. 这类快照变化属于允许的 break change，可以通过 `pnpm --filter=@visactor/vbi run g` 更新生成物。

### 6. 测试范围

测试至少覆盖以下行为：

1. `zVBIDimensionSchema` / `zVBIMeasure` 正确接受和拒绝 `sort`。
2. `DimensionNodeBuilder` / `MeasureNodeBuilder` 的 `setSort`、`getSort`、`clearSort`。
3. 无显式排序时，`buildVQuery()` 默认按第一个 dimension 升序。
4. 有 dimension 排序时，忽略默认逻辑并正确输出 `orderBy`。
5. 有 measure 排序时，忽略默认逻辑并正确输出 `orderBy`。
6. 同时存在多个 dimension / measure 排序时，输出顺序稳定且符合“dimension 在前，measure 在后”。
7. 带聚合的 measure 和带日期聚合的 dimension，排序字段都使用节点 `id`。

## Reference

- `packages/vbi/src/types/dsl/dimensions/dimensions.ts`
- `packages/vbi/src/types/dsl/measures/measures.ts`
- `packages/vbi/src/builder/features/dimensions/dim-node-builder.ts`
- `packages/vbi/src/builder/features/measures/mea-node-builder.ts`
- `packages/vbi/src/pipeline/vqueryDSL/index.ts`
- `packages/vbi/src/pipeline/vqueryDSL/buildSelect.ts`
- `packages/vquery/src/types/dsl/OrderBy.ts`

## 淘汰内容概述

- 不新增根级 `vbiDSL.orderBy`
- 不把 `sort` 设计成平铺字符串字段 `sort: 'asc' | 'desc'`
- 不新增 `sortAsc()` / `sortDesc()` 等 builder 语法糖
- 不在首期引入跨 shelf 的独立排序优先级字段
- 不把默认排序写回 DSL
