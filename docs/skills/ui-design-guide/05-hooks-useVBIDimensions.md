# 5. useVBIDimensions — 维度管理

## 签名

```ts
const {
  dimensions, // VBIDimension[]，当前维度列表
  addDimension, // (field: string, callback?: (node) => void) => void
  updateDimension, // (id: string, callback: (node) => void) => void
  removeDimension, // (id: string) => void
  findDimension, // (id: string) => node | undefined
} = useVBIDimensions(builder)
```

## 源码

`practices/standard/src/hooks/useVBIDimensions.ts`

## 用法示例

### 添加维度

```ts
// 简单添加（自动推断编码和别名）
addDimension('category')

// 添加时配置别名、编码、排序
addDimension('order_date', (node) => {
  node.setAlias('订单日期')
  node.setEncoding('xAxis')
  node.setAggregate({ func: 'toMonth' }) // 日期维度用 toMonth 聚合
  node.setSort({ order: 'desc' })
})
```

### 更新维度

```ts
updateDimension(dimId, (node) => {
  node.setAlias('新别名')
  node.setEncoding('color')
  node.setAggregate({ func: 'toQuarter' })
  node.setSort({ order: 'asc' })
})
```

### 删除维度

```ts
removeDimension(dimId)
```

### 查找维度节点

```ts
const node = findDimension(dimId)
if (node) {
  console.log(node.getField(), node.getEncoding())
}
```

---

## Node 可用方法（回调中）

| 方法                          | 说明                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `node.setAlias(alias)`        | 设置显示别名                                                                                     |
| `node.setEncoding(enc)`       | 设置编码：`xAxis`/`yAxis`/`color`/`detail`/`tooltip`/`label`/`row`/`column`/`player`/`hierarchy` |
| `node.setAggregate({ func })` | 设置日期聚合：`toYear`/`toQuarter`/`toMonth`/`toWeek`/`toDay` 等                                 |
| `node.setSort({ order })`     | 设置排序：`asc`/`desc`                                                                           |
| `node.clearAggregate()`       | 清除日期聚合                                                                                     |
| `node.clearSort()`            | 清除排序                                                                                         |
| `node.getId()`                | 获取维度 ID                                                                                      |
| `node.getField()`             | 获取字段名                                                                                       |

---

## 注意事项

- 所有操作通过 `builder.doc.transact()` 封装，自动支持 undo/redo
- 日期维度添加时，建议设置日期聚合（`toMonth`/`toYear` 等），否则默认不聚合
- `dimensions` 数组中每个元素的 `id` 用于 update/remove/delete 操作
