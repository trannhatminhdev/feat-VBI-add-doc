# 7. useVBIWhereFilter — WHERE 过滤

WHERE 过滤是**聚合前**的数据过滤，在 SQL 中对应 WHERE 子句。

## 签名

```ts
const {
  filters, // VBIWhereClause[]，原始嵌套条件树
  flattenFilters, // () => VBIWhereFilter[]，扁平化所有叶子条件
  addFilter, // (field: string, operator?: string, value?: unknown) => void
  addGroup, // (op: 'and'|'or', callback?: (group) => void) => void
  removeFilter, // (id: string) => void
  clearFilters, // () => void
  updateFilter, // (id: string, updates: { operator?, value? }) => void
  findFilter, // (id: string) => node | undefined
  updateGroup, // (id: string, updates: { operator?: 'and'|'or' }) => void
  addToGroup, // (groupId: string, field: string, operator?: string, value?: unknown) => void
  removeFromGroup, // (groupId: string, idOrIndex: string|number) => void
  findGroup, // (id: string) => node | undefined
} = useVBIWhereFilter(builder)
```

## 源码

`practices/standard/src/hooks/useVBIWhereFilter.ts`

## 用法示例

### 添加过滤条件

```ts
// 等值过滤
addFilter('region', '=', '华北')

// 模糊搜索
addFilter('product_name', 'contains', '手机')

// 范围过滤
addFilter('sales', '>', 1000)

// IN 列表
addFilter('category', 'in', ['电子产品', '服装'])

// 日期相对范围（最近 30 天）
addFilter('order_date', 'date', undefined) // 日期需通过 builder API 设置复杂结构
```

### 添加嵌套组

```ts
addGroup('and', (group) => {
  group.add('sales', (node) => {
    node.setOperator('>')
    node.setValue(1000)
  })
  group.add('profit', (node) => {
    node.setOperator('<')
    node.setValue(0)
  })
})
```

### 更新过滤条件

```ts
updateFilter(filterId, {
  operator: '>=',
  value: 5000,
})
```

### 删除、清空

```ts
removeFilter(filterId)
clearFilters()
```

### 向嵌套组添加条件

```ts
addToGroup(groupId, 'region', '=', '华东')
```

### 扁平化所有叶子条件

```ts
const flat = flattenFilters()
// flat: VBIWhereFilter[]，不含嵌套组
flat.forEach((f) => console.log(f.field, f.op, f.value))
```

---

## 操作符一览

| 操作符       | 说明       | 示例值                        |
| ------------ | ---------- | ----------------------------- |
| `=`          | 等于       | `'华北'`                      |
| `!=`         | 不等于     | `'华东'`                      |
| `>`          | 大于       | `1000`                        |
| `<`          | 小于       | `5000`                        |
| `>=`         | 大于等于   | `0`                           |
| `<=`         | 小于等于   | `10000`                       |
| `contains`   | 包含       | `'手机'`                      |
| `startsWith` | 开头匹配   | `'Apple'`                     |
| `endsWith`   | 结尾匹配   | `'Pro'`                       |
| `in`         | 在列表中   | `['A', 'B', 'C']`             |
| `not in`     | 不在列表中 | `['X', 'Y']`                  |
| `date`       | 日期范围   | 通过 `setDate()` 设置复杂结构 |

---

## 注意事项

- WHERE 过滤在聚合**之前**执行
- 日期过滤需通过 `builder.whereFilter.update(id, (node) => node.setDate(...))` 设置相对/绝对日期范围
- `flattenFilters()` 返回扁平的叶子节点数组，适合列表展示
- 嵌套组操作符（`and`/`or`）需使用 `updateGroup` 更新
