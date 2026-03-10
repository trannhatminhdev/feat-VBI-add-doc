# VBI 代码重构设计方案

**日期**: 2026-03-10
**目标**: 重构 VBI 代码，使其更易读、易理解

## 背景

当前 VBI 代码库基本符合标准，但存在以下问题需要优化：

1. `buildVQuery.ts` 文件行数过多（156行），包含多个构建函数
2. `buildWhere` 函数超过50行限制（53行）
3. `buildOrderBy` 函数为空实现，属于未使用代码
4. `types/index.ts` 存在重复导出 `having` 类型

## 重构目标

1. 函数不超过 50 行
2. 单个 class 不超过 200 行
3. 单个文件不超过 300 行
4. 删除没有用到的代码
5. index 全部用于索引，而非实现
6. test/lint/typecheck/format 保证全部通过
7. 没有 breakChange

## 方案设计

### 1. buildVQuery 重构

#### 1.1 目录结构

```
src/pipeline/vqueryDSL/
├── index.ts           # 主入口，组合所有构建器
├── types.ts           # 共享类型 buildPipe
├── buildSelect.ts     # 构建 SELECT 子句
├── buildGroupBy.ts    # 构建 GROUP BY 子句
├── buildWhere.ts      # 构建 WHERE 子句
├── buildHaving.ts    # 构建 HAVING 子句
└── buildLimit.ts     # 构建 LIMIT 子句
```

#### 1.2 文件职责

| 文件            | 职责                              | 行数预估 |
| --------------- | --------------------------------- | -------- |
| index.ts        | 主入口，使用 pipe 组合所有构建器  | ~20行    |
| types.ts        | 定义 buildPipe 类型               | ~5行     |
| buildSelect.ts  | 构建 SELECT 子句                  | ~25行    |
| buildGroupBy.ts | 构建 GROUP BY 子句                | ~10行    |
| buildWhere.ts   | 构建 WHERE 子句，拆分 filter 处理 | ~50行    |
| buildHaving.ts  | 构建 HAVING 子句                  | ~25行    |
| buildLimit.ts   | 构建 LIMIT 子句                   | ~10行    |

#### 1.3 buildWhere 内部拆分

将 `buildWhere` 中的 filter 处理逻辑拆分为：

```typescript
// buildWhere.ts
import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import type { VBIFilter } from 'src/types'

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
  // 处理 between 操作符
}

function handleSimpleFilter(filter: VBIFilter): Condition[] {
  // 处理简单操作符
}
```

### 2. 删除未使用代码

#### 2.1 删除 buildOrderBy

当前 `buildOrderBy` 实现为：

```typescript
const buildOrderBy: buildPipe = (queryDSL, context) => {
  // Order by is now handled separately via having or other mechanisms
  // This function is kept for potential future use
  void context
  return queryDSL
}
```

**决策**: 删除此函数及相关导出

#### 2.2 清理 types/index.ts 重复导出

当前 `types/index.ts`:

```typescript
export * from './dsl'
export * from './builder'
export * from './connector'
export * from './dsl/havingFilters/having' // 重复导出
```

**决策**: 移除 `./dsl/havingFilters/having` 导出（已在 dsl/index.ts 导出）

### 3. 验证计划

重构完成后必须通过：

```bash
pnpm run lint                    # 代码规范检查
pnpm run typecheck              # 类型检查
pnpm --filter=@visactor/vbi run test  # 测试通过
pnpm run format                 # 代码格式化
```

## 风险与回滚

1. **风险**: 拆分文件可能影响现有导入路径
   - **缓解**: 保持 index.ts 主入口不变，对外暴露 `buildVQuery` 函数

2. **风险**: 删除未使用代码可能影响外部依赖
   - **缓解**: 先检查所有外部引用，确认无使用后再删除

## 实施顺序

1. 拆分 buildVQuery 到多个文件
2. 删除 buildOrderBy 函数
3. 清理 types/index.ts 重复导出
4. 运行验证确保无破坏性变更
