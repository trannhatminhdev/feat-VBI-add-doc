# 执行计划: VBI 日期筛选器支持

> 基于 ADR: `docs/adr/2026-03-19-vbi-date-dimension-filter.md`
> TDD 驱动: 先写测试 → 再实现 → 全部测试通过

## 范围

本计划聚焦 VBI 核心包（`packages/vbi`），不含 `practices/demo` UI 改造。

## Phase 1: 类型定义与 Schema

### 1.1 新增日期筛选类型（先写测试）

**测试文件**: `packages/vbi/tests/types/dateFilterSchemas.test.ts`

测试内容:

- `zDatePredicate` 能正确验证 `range` / `relative` / `current` / `period` 四种类型
- `zVBIWhereDateFilter` 能正确验证 `{ op: 'date', value: DatePredicate }`
- `zVBIWhereScalarFilter` 能正确验证标量过滤（op !== 'date'）
- `zVBIWhereFilter` 联合类型能正确区分日期和标量
- 非法输入被 reject

### 1.2 实现类型文件

**改动文件**: `packages/vbi/src/types/dsl/whereFilter/filters.ts`

改动内容:

1. 重命名 `VBIFilter` → `VBIWhereFilter`，`zVBIFilter` → `zVBIWhereFilter`
2. 新增类型: `DateInput`, `DateUnit`, `DateBounds`, `DatePeriod`, `DatePredicate`
3. 新增 Zod schema: `zDatePredicate`, `zVBIWhereDateFilter`, `zVBIWhereScalarFilter`
4. `VBIWhereFilter = VBIWhereScalarFilter | VBIWhereDateFilter`

**改动文件**: `packages/vbi/src/types/dsl/index.ts`

改动内容:

- 更新导出: `VBIFilter` → `VBIWhereFilter`，新增 `DatePredicate` 等类型导出

## Phase 2: Builder 扩展

### 2.1 先写测试

**测试文件**: `packages/vbi/tests/builder/features/whereFilter.test.ts`（追加）

测试内容:

1. `WhereFilterNodeBuilder.setDate({ type: 'range', ... })` 正确存储
2. `WhereFilterNodeBuilder.setDate({ type: 'relative', ... })` 正确存储
3. `WhereFilterNodeBuilder.setDate({ type: 'current', ... })` 正确存储
4. `WhereFilterNodeBuilder.setDate({ type: 'period', ... })` 正确存储
5. `setDate()` 后 `toJSON()` 包含 `op: 'date'` 和 `value: DatePredicate`
6. `getDate()` 返回当前 DatePredicate 或 undefined

### 2.2 实现 Builder

**改动文件**: `packages/vbi/src/builder/features/whereFilter/where-node-builder.ts`

改动内容:

- 新增 `setDate(predicate: DatePredicate): this`
- 新增 `getDate(): DatePredicate | undefined`

## Phase 3: Pipeline Lowering

### 3.1 先写测试

**测试文件**: `packages/vbi/tests/builder/features/whereFilter.test.ts`（追加 buildVQuery 测试）

测试内容:

1. `range` 过滤 → `>= start AND < end`（默认 `[)` 边界）
2. `range` 过滤 `bounds: '[]'` → `>= start AND <= end`
3. `period(year)` → `>= 2024-01-01 AND < 2025-01-01`
4. `period(quarter)` → `>= 季度起始 AND < 季度结束`
5. `period(month)` → `>= 月份起始 AND < 下月起始`
6. `period(week)` → `>= 周起始 AND < 下周起始`（ISO-8601）
7. `period(day)` → `>= 日期 AND < 下一天`
8. `relative(last 7 day)` → 根据 now 计算范围
9. `current(month)` → 根据 now 计算当月范围
10. `current(month, offset: -1)` → 根据 now 计算上月范围
11. 日期过滤与标量过滤混合使用

### 3.2 实现 Lowering

**新增文件**: `packages/vbi/src/pipeline/vqueryDSL/resolveDatePredicate.ts`

职责:

- 将 `DatePredicate` 解析为 `{ start: string, end: string, bounds: DateBounds }` 绝对范围
- 支持注入 `now` 以方便测试

**改动文件**: `packages/vbi/src/pipeline/vqueryDSL/buildWhere.ts`

改动内容:

- `mapFilterToCondition` 增加 `op === 'date'` 分支
- 调用 `resolveDatePredicate` 将日期语义解析为绝对范围
- 将绝对范围转换为 vquery `>=` / `<` / `<=` 条件

## Phase 4: 向后兼容与类型导出

### 4.1 保持旧类型名可用

**改动文件**: `packages/vbi/src/types/dsl/whereFilter/filters.ts`

- 保留 `VBIFilter` 作为 `VBIWhereFilter` 的别名（deprecated）
- 保留 `zVBIFilter` 作为 `zVBIWhereFilter` 的别名（deprecated）

### 4.2 更新引用

- 更新 `src/utils/filter-guards.ts` 中的 `isVBIFilter` 引用
- 更新 `src/pipeline/vqueryDSL/buildWhere.ts` 中的类型引用
- 确保 `src/index.ts` 导出新类型

## Phase 5: 验证

```bash
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

全部通过才算完成。

## 执行顺序

| 步骤 | 动作               | 文件                                                               |
| ---- | ------------------ | ------------------------------------------------------------------ |
| 1    | 写 schema 测试     | `tests/types/dateFilterSchemas.test.ts`                            |
| 2    | 实现类型 + schema  | `src/types/dsl/whereFilter/filters.ts`                             |
| 3    | 运行 schema 测试   | 验证通过                                                           |
| 4    | 写 builder 测试    | `tests/builder/features/whereFilter.test.ts`                       |
| 5    | 实现 builder       | `src/builder/features/whereFilter/where-node-builder.ts`           |
| 6    | 运行 builder 测试  | 验证通过                                                           |
| 7    | 写 lowering 测试   | `tests/builder/features/whereFilter.test.ts`                       |
| 8    | 实现 lowering      | `src/pipeline/vqueryDSL/resolveDatePredicate.ts` + `buildWhere.ts` |
| 9    | 运行 lowering 测试 | 验证通过                                                           |
| 10   | 更新导出和向后兼容 | `src/types/dsl/index.ts`, `src/index.ts`                           |
| 11   | 全量验证           | `test + lint + typecheck`                                          |
