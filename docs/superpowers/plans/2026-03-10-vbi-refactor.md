# VBI 代码重构实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 VBI 代码，将 buildVQuery 拆分为多个文件，删除未使用代码，确保无破坏性变更

**Architecture:** 将 `pipeline/vqueryDSL/buildVQuery.ts` 拆分为独立的模块文件，每个构建函数一个文件

**Tech Stack:** TypeScript, Yjs, Remeda

---

## 文件结构

```
src/pipeline/vqueryDSL/
├── index.ts           # 主入口 (原 buildVQuery.ts 重构)
├── types.ts           # 共享类型 buildPipe
├── buildSelect.ts     # 构建 SELECT 子句
├── buildGroupBy.ts    # 构建 GROUP BY 子句
├── buildWhere.ts      # 构建 WHERE 子句
├── buildHaving.ts    # 构建 HAVING 子句
└── buildLimit.ts     # 构建 LIMIT 子句
```

**需要修改的文件：**

- `packages/vbi/src/pipeline/vqueryDSL/buildVQuery.ts` → 重构为 `index.ts`
- `packages/vbi/src/types/index.ts` → 移除重复导出

---

## Chunk 1: 创建 types.ts 和拆分 buildSelect/buildGroupBy/buildLimit

### Task 1: 创建 types.ts 共享类型文件

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/types.ts`

- [ ] **Step 1: 创建 types.ts**

```typescript
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIDSL } from '../../types'
import type { VBIBuilder } from '../../builder'

export type buildPipe = (queryDSL: VQueryDSL, context: { vbiDSL: VBIDSL; builder: VBIBuilder }) => VQueryDSL
```

- [ ] **Step 2: 验证文件创建成功**

Run: `ls packages/vbi/src/pipeline/vqueryDSL/types.ts`

- [ ] **Step 3: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/types.ts
git commit -m "refactor(vbi): add types.ts for buildPipe type"
```

---

### Task 2: 创建 buildSelect.ts

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/buildSelect.ts`

- [ ] **Step 1: 创建 buildSelect.ts**

```typescript
import type { Select, VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { MeasuresBuilder, DimensionsBuilder } from '../../builder'

export const buildSelect: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const measures = vbiDSL.measures
  const dimensions = vbiDSL.dimensions

  const result = { ...queryDSL }
  const measureNodes = measures.filter((measure) => MeasuresBuilder.isMeasureNode(measure))
  const measureSelects: Select<Record<string, unknown>> = measureNodes.map((measure) => ({
    field: measure.field,
    alias: measure.alias,
    aggr: measure.aggregate,
  }))

  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
  const dimensionSelects: Select<Record<string, unknown>> = dimensionNodes.map((dimension) => ({
    field: dimension.field,
    alias: dimension.alias,
  }))

  result.select = measureSelects.concat(dimensionSelects)

  return result as VQueryDSL
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/buildSelect.ts
git commit -m "refactor(vbi): extract buildSelect to separate file"
```

---

### Task 3: 创建 buildGroupBy.ts

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/buildGroupBy.ts`

- [ ] **Step 1: 创建 buildGroupBy.ts**

```typescript
import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { DimensionsBuilder } from '../../builder'

export const buildGroupBy: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const { vbiDSL } = context
  const dimensions = vbiDSL.dimensions
  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))

  result.groupBy = dimensionNodes.map((dimension) => dimension.field)
  return result as VQueryDSL
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/buildGroupBy.ts
git commit -m "refactor(vbi): extract buildGroupBy to separate file"
```

---

### Task 4: 创建 buildLimit.ts

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/buildLimit.ts`

- [ ] **Step 1: 创建 buildLimit.ts**

```typescript
import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'

export const buildLimit: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const limit = context.vbiDSL.limit ?? 1000
  result.limit = limit

  return result as VQueryDSL
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/buildLimit.ts
git commit -m "refactor(vbi): extract buildLimit to separate file"
```

---

## Chunk 2: 创建 buildWhere.ts 和 buildHaving.ts

### Task 5: 创建 buildWhere.ts (包含内联函数拆分)

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/buildWhere.ts`

- [ ] **Step 1: 创建 buildWhere.ts**

```typescript
import type { VQueryDSL, Condition } from '@visactor/vquery'
import type { buildPipe } from './types'
import type { VBIFilter } from '../../../types'

export const buildWhere: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const whereFilters = vbiDSL.whereFilters || []

  if (whereFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.where = {
    op: 'and',
    conditions: whereFilters.flatMap(mapFilterToCondition),
  }

  return result as VQueryDSL
}

function mapFilterToCondition(filter: VBIFilter): Condition[] {
  if (filter.operator === 'between') {
    return handleBetweenFilter(filter)
  }
  return handleSimpleFilter(filter)
}

function handleBetweenFilter(filter: VBIFilter): Condition[] {
  const conditions: Condition[] = []
  const value = filter.value as { min?: unknown; max?: unknown; leftOp?: string; rightOp?: string }

  if (value.min !== undefined && value.min !== null && value.min !== '') {
    conditions.push({
      field: filter.field,
      op: value.leftOp === '<' ? '>' : '>=',
      value: value.min,
    })
  }
  if (value.max !== undefined && value.max !== null && value.max !== '') {
    conditions.push({
      field: filter.field,
      op: value.rightOp === '<' ? '<' : '<=',
      value: value.max,
    })
  }
  return conditions
}

function handleSimpleFilter(filter: VBIFilter): Condition[] {
  let mappedOp = filter.operator ?? '='
  const value = filter.value

  if (Array.isArray(value)) {
    if (mappedOp === '=') mappedOp = 'in'
    if (mappedOp === '!=') mappedOp = 'not in'
  }

  return [
    {
      field: filter.field,
      op: mappedOp,
      value,
    },
  ] as Condition[]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/buildWhere.ts
git commit -m "refactor(vbi): extract buildWhere to separate file with helper functions"
```

---

### Task 6: 创建 buildHaving.ts

**Files:**

- Create: `packages/vbi/src/pipeline/vqueryDSL/buildHaving.ts`

- [ ] **Step 1: 创建 buildHaving.ts**

```typescript
import type { VQueryDSL, Condition } from '@visactor/vquery'
import type { buildPipe } from './types'

export const buildHaving: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const havingFilters = vbiDSL.havingFilters || []

  if (havingFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.having = {
    op: 'and',
    conditions: havingFilters.map((filter) => {
      const mappedOp = filter.operator ?? '='
      return {
        field: filter.field,
        op: mappedOp,
        value: filter.value,
      } as Condition
    }),
  }

  return result as VQueryDSL
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/buildHaving.ts
git commit -m "refactor(vbi): extract buildHaving to separate file"
```

---

## Chunk 3: 重构 index.ts 并清理重复导出

### Task 7: 重构 index.ts (原 buildVQuery.ts)

**Files:**

- Modify: `packages/vbi/src/pipeline/vqueryDSL/buildVQuery.ts` → 删除内容，从 index.ts 导出
- Create: `packages/vbi/src/pipeline/vqueryDSL/index.ts`

- [ ] **Step 1: 创建 index.ts**

```typescript
import { pipe } from 'remeda'
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIDSL } from '../../types'
import type { VBIBuilder } from '../../builder'
import type { buildPipe } from './types'
import { buildSelect } from './buildSelect'
import { buildGroupBy } from './buildGroupBy'
import { buildWhere } from './buildWhere'
import { buildHaving } from './buildHaving'
import { buildLimit } from './buildLimit'

const wrapper = (processor: buildPipe) => {
  return (queryDSL: VQueryDSL): VQueryDSL => processor(queryDSL, { vbiDSL, builder })
}

export const buildVQuery = (vbiDSL: VBIDSL, builder: VBIBuilder) => {
  return pipe(
    {} as VQueryDSL,
    wrapper(buildSelect),
    wrapper(buildGroupBy),
    wrapper(buildWhere),
    wrapper(buildHaving),
    wrapper(buildLimit),
  )
}
```

- [ ] **Step 2: 修改 pipeline/index.ts 导出**

修改 `packages/vbi/src/pipeline/index.ts`:

```typescript
-export { buildVQuery } from './vqueryDSL'
+export { buildVQuery } from './vqueryDSL/index'
```

- [ ] **Step 3: 删除旧文件 buildVQuery.ts**

```bash
rm packages/vbi/src/pipeline/vqueryDSL/buildVQuery.ts
```

- [ ] **Step 4: Commit**

```bash
git add packages/vbi/src/pipeline/vqueryDSL/index.ts
git add packages/vbi/src/pipeline/index.ts
git rm packages/vbi/src/pipeline/vqueryDSL/buildVQuery.ts
git commit -m "refactor(vbi): restructure buildVQuery as index with imported builders"
```

---

### Task 8: 清理 types/index.ts 重复导出

**Files:**

- Modify: `packages/vbi/src/types/index.ts`

- [ ] **Step 1: 移除重复导出**

当前 `packages/vbi/src/types/index.ts`:

```typescript
export * from './dsl'
export * from './builder'
export * from './connector'
export * from './dsl/havingFilters/having'  # 删除这行
```

修改为:

```typescript
export * from './dsl'
export * from './builder'
export * from './connector'
```

- [ ] **Step 2: Commit**

```bash
git add packages/vbi/src/types/index.ts
git commit -m "refactor(vbi): remove duplicate having type export"
```

---

## Chunk 4: 验证和测试

### Task 9: 运行验证确保无破坏性变更

- [ ] **Step 1: 运行 lint**

Run: `pnpm --filter=@visactor/vbi run lint`
Expected: PASS (无错误)

- [ ] **Step 2: 运行 typecheck**

Run: `pnpm run typecheck`
Expected: PASS (无错误)

- [ ] **Step 3: 运行测试**

Run: `pnpm --filter=@visactor/vbi run test`
Expected: PASS (所有测试通过)

- [ ] **Step 4: 运行 format**

Run: `pnpm run format`
Expected: 无需提交 (代码已格式化)

- [ ] **Step 5: Commit 验证修改**

```bash
git add -A
git commit -m "test: verify refactor passes all checks"
```

---

## 总结

重构完成后:

- `buildVQuery` 拆分为 6 个独立文件
- 每个文件 < 50 行
- 删除了未使用的 `buildOrderBy` 函数
- 清理了 `types/index.ts` 重复导出
- 所有测试通过，无破坏性变更
