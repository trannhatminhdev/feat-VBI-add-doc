# VQuery 代码重构设计方案

## 目标

将 VQuery 代码重构为更易读、易理解的模块化结构：

1. 函数不超过 50 行
2. 单个 class 不超过 100 行
3. 单个文件不超过 120 行
4. 删除没有用到的代码
5. index.ts 全部用于索引，而非实现
6. 保证 test/lint/typecheck/format 全部通过
7. 无 breaking change（src/index 全部导出）

## 当前问题

| 文件                                           | 行数 | 问题                                        |
| ---------------------------------------------- | ---- | ------------------------------------------- |
| `VQuery.ts`                                    | 103  | 超过 100 行                                 |
| `dataset/dataset.ts`                           | 123  | 超过 120 行                                 |
| `sql-builder/builders/having.ts`               | 74   | 接近 50 行限制，且与 where.ts 重复          |
| `sql-builder/builders/select.ts`               | 70   | 接近 50 行限制                              |
| `sql-builder/builders/where.ts`                | 65   | 与 having.ts 重复 operatorMap/toSqlOperator |
| `adapters/storage-adapter/indexeddbAdapter.ts` | 134  | 超过 120 行                                 |
| `adapters/storage-adapter/inmemoryAdapter.ts`  | 65   | 接近限制                                    |
| `adapters/query-adapter/duckdbWebAdapter.ts`   | 86   | 超过 50 行函数限制                          |
| `adapters/query-adapter/duckdbNodeAdapter.ts`  | 82   | 超过 50 行函数限制                          |

## 重构方案

### 1. 共享工具层

创建 `sql-builder/utils/` 目录，提取重复代码：

**文件：`sql-builder/utils/operator.ts`**

```typescript
const operatorMap: Record<string, string> = {
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  eq: '=',
  neq: '!=',
}

export const toSqlOperator = (op: string): string => {
  return operatorMap[op] ?? op
}
```

**文件：`sql-builder/utils/conditions.ts`**

```typescript
// 共享的 condition 树转换逻辑
export const buildConditionRaw = (condition, toSqlOperator, buildLeaf) => { ... }
```

### 2. SQL Builder 重构

将 `builders/` 目录重组为：

```
sql-builder/builders/
├── index.ts              # 索引：export * from './select'
├── select/
│   ├── index.ts
│   ├── applySelect.ts    # ~40 行
│   └── aggregators.ts    # 提取聚合函数处理逻辑
├── where/
│   ├── index.ts
│   └── applyWhere.ts     # ~35 行（调用共享工具）
├── having/
│   ├── index.ts
│   └── applyHaving.ts    # ~35 行（调用共享工具）
├── groupBy.ts            # ~20 行
├── order.ts              # ~15 行
└── limit.ts              # ~10 行
```

### 3. Dataset 模块拆分

```
dataset/
├── index.ts              # 索引
├── dataset.ts            # ~80 行，仅保留核心类
├── view.ts               # createOrReplaceView 逻辑 (~30 行)
├── constants.ts          # READ_FUNCTION_MAP, DATA_TYPE_MAP
└── query.ts             # 查询执行逻辑 (~20 行)
```

### 4. VQuery 主类优化

`VQuery.ts` 优化为约 80 行：

- 删除重复的 checkDatasetExists 逻辑
- 将数据集操作委托给更小的函数

### 5. Adapters 优化

对于 storage-adapter 和 query-adapter：

- 提取常量到独立文件
- 拆分过大的函数

## 导出策略

保持 `src/index.ts` 导出所有公开 API，确保无 breaking change：

```typescript
// src/index.ts
export * from './VQuery'
export * from './dataset'
export * from './sql-builder'
export * from './types'
export * from './data-source-builder'
export * from './utils'
```

## 验证清单

- [ ] `pnpm --filter=@visactor/vquery run test` 通过
- [ ] `pnpm --filter=@visactor/vquery run lint` 通过
- [ ] `pnpm run typecheck` 通过
- [ ] `pnpm --filter=@visactor/vquery run format` 通过
- [ ] 所有文件行数符合限制
- [ ] index.ts 仅用于索引
