# 2. VBI-react 与各 Practice 自有 Hooks 签名完全不同

## 问题描述

两组 hooks 同名但**完全不可互换**，是最容易出错的地方：

| vbi-react hook                | 各 practice 自有 hook             | 核心差异         |
| ----------------------------- | --------------------------------- | ---------------- |
| `useDimensions(builder)` 必传 | `useVBIDimensions(builder?)` 可选 | builder 参数可选 |
| `useMeasures(builder)` 必传   | `useVBIMeasures(builder?)` 可选   | builder 参数可选 |
| `useWhereFilter(builder)`     | `useVBIWhereFilter(builder?)`     | 返回值完全不同   |
| `useHavingFilter(builder)`    | `useVBIHavingFilter(builder?)`    | 返回值完全不同   |
| `useChartType(builder)`       | `useVBIChartType(builder?)`       | 返回值略有不同   |
| —                             | `useVBIBuilder(builder?)`         | 各 practice 独有 |
| —                             | `useVBISchemaFields(builder?)`    | 各 practice 独有 |
| —                             | `useVBIUndoManager(builder?)`     | 各 practice 独有 |

## useWhereFilter 返回值对比

**vbi-react 版本**：

```ts
{
  ;(whereFilter, mutateWhereFilter, clearWhereFilter, removeWhereEntry)
}
```

**standard 版本**：

```ts
{
  filters,           // VBIWhereClause[]，原始嵌套条件树
  flattenFilters,     // VBIWhereFilter[]，扁平化所有叶子条件
  addFilter,         // (field, operator?, value?) => void
  addGroup,          // (op: 'and'|'or', callback?) => void
  removeFilter,      // (id) => void
  clearFilters,      // () => void
  updateFilter,      // (id, { operator?, value? }) => void
  findFilter,        // (id) => node | undefined
  updateGroup,       // (id, { operator? }) => void
  addToGroup,        // (groupId, field, operator?, value?) => void
  removeFromGroup,   // (groupId, idOrIndex) => void
  findGroup,         // (id) => node | undefined
}
```

## addDimension / addMeasure 方式对比

**vbi-react 版本**（config 对象）：

```ts
addDimension('category', { alias: '产品类别' })
```

**standard 版本**（回调模式，支持任意 node 方法）：

```ts
addDimension('category', (node) => {
  node.setEncoding('xAxis')
  node.setSort({ order: 'asc' })
})
```

## 实际开发选择

大部分 practice（minimalist/streamlined/professional/standard）使用 **自己实现的 hooks**（`src/hooks/`），功能更完整。只有 `vbi-react-starter` 使用 `@visactor/vbi-react` 包中的 hooks。

**这两套 hooks 完全不可互换**，是最容易出错的地方。每个 practice 只使用自己 `src/hooks/` 目录下的 hooks，从不引用 `@visactor/vbi-react`。

## 源码位置

| hook                            | 位置                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| vbi-react hooks                 | `packages/vbi-react/src/hooks/`                                           |
| 各 practice 自有 hooks          | `practices/{name}/src/hooks/`（每个 practice 独立一套）                   |
| useFilterRootOperator（未导出） | `practices/standard/src/components/Shelfs/hooks/useFilterRootOperator.ts` |
