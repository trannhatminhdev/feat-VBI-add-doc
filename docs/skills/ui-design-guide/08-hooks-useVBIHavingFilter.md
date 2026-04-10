# 8. useVBIHavingFilter — HAVING 过滤

HAVING 过滤是**聚合后**的数据过滤，在 SQL 中对应 HAVING 子句。用于筛选已聚合的计算结果（如总销售额 > 5000 的地区）。

## 签名

```ts
const {
  filters, // VBIHavingClause[]，嵌套条件树
  addFilter, // (field: string, aggregate?: VBIHavingAggregate, operator?: string, value?: unknown) => void
  addGroup, // (op: 'and'|'or', callback?: (group) => void) => void
  removeFilter, // (id: string) => void
  clearFilters, // () => void
  updateFilter, // (id: string, updates: { aggregate?, operator?, value? }) => void
  findFilter, // (id: string) => node | undefined
} = useVBIHavingFilter(builder)
```

## 源码

`practices/standard/src/hooks/useVBIHavingFilter.ts`

## 用法示例

### 添加 HAVING 条件

```ts
// 简单添加（默认 operator 和 aggregate）
addFilter('sales', { func: 'sum' }, '>', 5000)

// 指定聚合函数
addFilter('profit', { func: 'avg' }, '>=', 0)

// 仅指定聚合（默认 > 0）
addFilter('order_count', { func: 'count' })
```

### 添加嵌套组

```ts
addGroup('and', (group) => {
  // group 中可以继续调用 builder.havingFilter.add(...)
})
```

### 更新过滤条件

```ts
updateFilter(filterId, {
  aggregate: { func: 'sum' },
  operator: '>=',
  value: 10000,
})
```

### 删除、清空

```ts
removeFilter(filterId)
clearFilters()
```

### 查找过滤节点

```ts
const node = findFilter(filterId)
if (node) {
  console.log(node.getField(), node.getAggregate(), node.getOperator())
}
```

---

## HAVING vs WHERE 区别

| 特性     | WHERE          | HAVING              |
| -------- | -------------- | ------------------- |
| 执行时机 | 聚合**之前**   | 聚合**之后**        |
| 可用字段 | 任意原始字段   | 需配合聚合函数使用  |
| 典型场景 | 筛选地区为华北 | 筛选总销售额 > 5000 |

---

## 操作符一览

| 操作符 | 说明     | 示例值  |
| ------ | -------- | ------- |
| `>`    | 大于     | `5000`  |
| `<`    | 小于     | `1000`  |
| `>=`   | 大于等于 | `0`     |
| `<=`   | 小于等于 | `10000` |
| `=`    | 等于     | `100`   |
| `!=`   | 不等于   | `50`    |

---

## 注意事项

- HAVING 过滤在聚合**之后**执行，用于筛选聚合结果
- `aggregate` 参数为 `{ func: string; quantile?: number }`，常用值：`sum`/`avg`/`count`/`countDistinct`/`min`/`max`/`median`
- 所有操作通过 `builder.doc.transact()` 封装，自动支持 undo/redo
