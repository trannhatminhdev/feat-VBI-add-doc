# ADR-001: VQuery 自定义表达式字段

## Status

Proposed

## Context

当前 `@visactor/vquery` 的 clause 都直接引用物理字段名，还没有“逻辑字段”这一层，所以有四个直接问题：

1. `select` 里定义出的别名，不能稳定复用到 `where/groupBy/having`。
2. `sales - profit as cost` 这类计算字段，无法像普通字段一样参与全部 clause。
3. 如果给每个 clause 单独加 `expr`，表达式会重复，VBI 也无法做到 Single Source of Truth。
4. `Where<T>` / `Having<T>` 依赖 `keyof T`，无法覆盖运行时新增的 expr 字段。

## Decision

### 1. 新增 `fields` 注册表，所有可引用字段都先定义在这里

```ts
type VQueryExpr =
  | { type: 'column'; name: string }
  | { type: 'field'; id: string }
  | { type: 'literal'; value: string | number | boolean | null }
  | { type: 'unary'; op: '+' | '-'; expr: VQueryExpr }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '%'; left: VQueryExpr; right: VQueryExpr }
  | { type: 'call'; name: string; args?: VQueryExpr[] }
type VQueryField = { id: string; expr: VQueryExpr }
type QueryDSL = {
  fields?: VQueryField[]
  select: Array<string | { field: string; alias?: string; aggr?: Aggregate }>
  where?: Where
  groupBy?: string[]
  having?: Having
  orderBy?: Array<{ field: string; order?: 'asc' | 'desc' }>
  limit?: number
}
```

语义约束：

1. `fields` 是 SSOT。物理列也用 `expr` 表达，例如 `sales -> column(sales)`。
2. 各 clause 只引用字段 `id`，不在 clause 内重复携带 `expr`。
3. `select.aggr` / `having.aggr` 只保留真正聚合；`to_year/to_month/...` 这类字段变换收敛进 `expr`。
4. `call.name` 和 `op` 只允许白名单值，不接受 raw SQL 片段。

### 2. `Where` / `Having` 收敛为运行时结构

```ts
type WhereLeaf = { field: string; op: Operator; value?: unknown }
type HavingLeaf = { field: string; op: HavingOperator; aggr: HavingAggregation; value?: unknown }
```

这里不再尝试用 `keyof T` 穷举所有字段。expr 字段本来就是运行时定义的，首期以 DSL 一致性和编译正确性优先。

### 3. SQL 编译改为“两层 lowering”

1. 入口先归一化 legacy DSL，把旧的 `field: 'sales'` 自动补成 `fields` 里的列定义。
2. 递归展开 `expr` 中的 `{ type: 'field' }`，并检测循环依赖。
3. 先生成内层投影：`from (select <expr as id>... from source) as __vquery_base`。
4. 外层继续复用现有 `select/where/groupBy/having/orderBy/limit` builder，只是字段来源改为 `__vquery_base`。

这样 `cost/profit_margin/rand` 等字段就能像普通列一样进入 `where`、`groupBy`、`having`、`orderBy` 和 `select`。

### 4. 示例

```ts
{
  fields: [{ id: 'sales', expr: { type: 'column', name: 'sales' } }, { id: 'profit', expr: { type: 'column', name: 'profit' } }, { id: 'cost', expr: { type: 'binary', op: '-', left: { type: 'field', id: 'sales' }, right: { type: 'field', id: 'profit' } } }, { id: 'profit_margin', expr: { type: 'binary', op: '/', left: { type: 'field', id: 'profit' }, right: { type: 'call', name: 'nullif', args: [{ type: 'field', id: 'sales' }, { type: 'literal', value: 0 }] } } }, { id: 'rand', expr: { type: 'call', name: 'random' } }],
  select: [{ field: 'cost' }, { field: 'profit_margin' }],
  where: { op: 'and', conditions: [{ field: 'cost', op: '>', value: 0 }] },
  orderBy: [{ field: 'profit_margin', order: 'desc' }]
}
```

### 5. 非目标

1. 不支持 raw SQL 字符串 `expr`。
2. 不支持窗口函数 / `over` / `lag` / 真正跨行增长率。
3. 不支持子查询表达式。
4. 不在首期做跨方言函数映射，只做结构化 AST 到 SQL 的安全拼接。

## Consequences

Positive: clause 结构基本不变，改动集中在 `types`、`expr builder`、`dslToSQL`；VBI 只需为每个字段产出 `id + expr`。
Negative: `Where/Having` 的静态类型会比现在更宽；复杂同比/环比要第二阶段再加 `window` 节点。

## Reference

- `packages/vquery/src/types/dsl/Select.ts`
- `packages/vquery/src/types/dsl/Where.ts`
- `packages/vquery/src/types/dsl/Having.ts`
- `packages/vquery/src/sql-builder/builders/select.ts`
- `packages/vquery/src/sql-builder/builders/where.ts`
- `packages/vquery/src/sql-builder/builders/having.ts`
- `packages/vquery/src/sql-builder/dslToSQL.ts`
