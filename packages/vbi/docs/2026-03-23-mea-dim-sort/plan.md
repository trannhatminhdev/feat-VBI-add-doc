# 执行计划: VBI Measure / Dimension 排序支持

> 基于 ADR: `./adr.md`
> TDD 驱动: 先写测试 → 再实现 → 生成产物 → 全部验证通过

## 范围

本计划聚焦 VBI 核心包（`packages/vbi`），只处理排序 DSL、builder、`buildVQuery().orderBy` lowering，以及由默认排序引起的生成物和快照更新；不包含 `practices/demo` UI 改造。

## Phase 1: 排序类型与 Schema

### 1.1 先写 schema 测试

**测试文件**: `packages/vbi/tests/types/sortSchemas.test.ts`（新增）

测试内容:

1. `zVBISort` 正确接受 `{ order: 'asc' }` 和 `{ order: 'desc' }`
2. 非法 `order` 值被 reject
3. `zVBIDimensionSchema` 正确接受带 `sort` 的 dimension
4. `zVBIMeasure` 正确接受带 `sort` 的 measure
5. `zVBIDSL` 正确接受包含排序节点的完整 DSL

### 1.2 实现共享排序类型

**新增文件**: `packages/vbi/src/types/dsl/sort.ts`

改动内容:

1. 新增 `VBISortOrder = 'asc' | 'desc'`
2. 新增 `VBISort = { order: VBISortOrder }`
3. 新增 `zVBISortOrder` 与 `zVBISort`

**改动文件**:

- `packages/vbi/src/types/dsl/dimensions/dimensions.ts`
- `packages/vbi/src/types/dsl/measures/measures.ts`
- `packages/vbi/src/types/dsl/index.ts`

改动内容:

1. dimension / measure schema 增加可选 `sort`
2. dimension / measure 类型接入 `sort?: VBISort`
3. `types/dsl/index.ts` 导出 `VBISort` / `VBISortOrder`

## Phase 2: Builder 扩展

### 2.1 先写 builder 测试

**测试文件**: `packages/vbi/tests/builder/features/sort.test.ts`（新增）

测试内容:

1. `DimensionNodeBuilder.setSort()` 正确存储排序配置
2. `DimensionNodeBuilder.getSort()` 返回当前 `sort` 或 `undefined`
3. `DimensionNodeBuilder.clearSort()` 清除排序配置
4. `MeasureNodeBuilder.setSort()` / `getSort()` / `clearSort()` 行为正确
5. `setSort()` 支持链式调用
6. `toJSON()` 在设置和清除排序后输出正确

### 2.2 实现 NodeBuilder

**改动文件**:

- `packages/vbi/src/builder/features/dimensions/dim-node-builder.ts`
- `packages/vbi/src/builder/features/measures/mea-node-builder.ts`

改动内容:

1. 新增 `setSort(sort: VBISort): this`
2. 新增 `getSort(): VBISort | undefined`
3. 新增 `clearSort(): this`

## Phase 3: buildVQuery 排序 Lowering

### 3.1 先写 query 测试

**测试文件**: `packages/vbi/tests/query/orderBy.test.ts`（新增）

测试内容:

1. 无显式排序时，`buildVQuery()` 默认按第一个 dimension 升序
2. 无显式排序且没有 dimension 时，不输出 `orderBy`
3. dimension 显式排序时，忽略默认逻辑
4. measure 显式排序时，忽略默认逻辑
5. 多个 dimension 同时排序时，保持 `dimensions` 当前顺序
6. 多个 measure 同时排序时，保持 `measures` 当前顺序
7. dimension 与 measure 同时排序时，输出顺序固定为“dimension 在前，measure 在后”
8. 带聚合的 measure 排序使用节点 `id`
9. 带日期聚合的 dimension 排序使用节点 `id`

### 3.2 实现 `buildOrderBy`

**新增文件**: `packages/vbi/src/pipeline/vqueryDSL/buildOrderBy.ts`

职责:

1. 收集已配置 `sort` 的 dimension / measure 节点
2. 将排序节点映射为 `VQueryDSL.orderBy`
3. 在无显式排序时应用“第一个 dimension 升序”的默认规则

**改动文件**: `packages/vbi/src/pipeline/vqueryDSL/index.ts`

改动内容:

1. 接入 `buildOrderBy`
2. 调整流水线顺序为 `select -> groupBy -> where -> having -> orderBy -> limit`

## Phase 4: 生成物与快照更新

### 4.1 重新生成测试、示例与 API

**命令**:

```bash
pnpm --filter=@visactor/vbi run g
```

目的:

1. 更新因默认排序新增而变化的单测和快照
2. 更新 examples 生成物
3. 更新 API 生成物

### 4.2 检查生成结果

重点关注:

1. 现有 examples 的 `buildVQuery()` 输出是否新增了默认 `orderBy`
2. 生成测试是否与 ADR 中的排序规则一致
3. 是否出现与排序无关的意外 diff

## Phase 5: 验证

```bash
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

全部通过才算完成。

## 执行顺序

| 步骤 | 动作                                     | 文件                                                                |
| ---- | ---------------------------------------- | ------------------------------------------------------------------- |
| 1    | 写 schema 测试                           | `tests/types/sortSchemas.test.ts`                                   |
| 2    | 实现共享排序类型与导出                   | `src/types/dsl/sort.ts` + `src/types/dsl/{dimensions,measures}/...` |
| 3    | 写 builder 测试                          | `tests/builder/features/sort.test.ts`                               |
| 4    | 实现 builder 方法                        | `src/builder/features/{dimensions,measures}/*-node-builder.ts`      |
| 5    | 写 query 排序测试                        | `tests/query/orderBy.test.ts`                                       |
| 6    | 实现 `buildOrderBy` 与接线               | `src/pipeline/vqueryDSL/buildOrderBy.ts` + `index.ts`               |
| 7    | 运行 `pnpm --filter=@visactor/vbi run g` | 更新生成物与快照                                                    |
| 8    | 全量验证                                 | `test + lint + typecheck`                                           |
