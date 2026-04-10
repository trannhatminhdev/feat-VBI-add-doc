# 6. useVBIMeasures — 度量管理

## 签名

```ts
const {
  measures, // VBIMeasure[]，当前度量列表
  addMeasure, // (field: string, callback?: (node) => void) => void
  updateMeasure, // (id: string, callback: (node) => void) => void
  removeMeasure, // (id: string) => void
  findMeasure, // (id: string) => node | undefined
} = useVBIMeasures(builder)
```

## 源码

`practices/standard/src/hooks/useVBIMeasures.ts`

## 用法示例

### 添加度量

```ts
// 简单添加（默认 sum 聚合）
addMeasure('sales')

// 添加时配置别名、聚合、编码、格式
addMeasure('profit', (node) => {
  node.setAlias('利润')
  node.setAggregate({ func: 'avg' })
  node.setEncoding('yAxis')
  node.setFormat({ autoFormat: false, prefix: '$', decimalCount: 2 })
  node.setSort({ order: 'desc' })
})
```

### 更新度量

```ts
updateMeasure(meaId, (node) => {
  node.setAlias('新别名')
  node.setEncoding('size') // 改为 size 编码
  node.setAggregate({ func: 'median' })
  node.setFormat({ autoFormat: false, suffix: '元', decimalCount: 0 })
  node.setSort({ order: 'desc' })
})
```

### 删除度量

```ts
removeMeasure(meaId)
```

### 查找度量节点

```ts
const node = findMeasure(meaId)
if (node) {
  console.log(node.getField(), node.getAggregate())
}
```

---

## Node 可用方法（回调中）

| 方法                                     | 说明                                                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node.setAlias(alias)`                   | 设置显示别名                                                                                                                                                                              |
| `node.setEncoding(enc)`                  | 设置编码：`yAxis`/`xAxis`/`primaryYAxis`/`secondaryYAxis`/`angle`/`radius`/`size`/`color`/`detail`/`column`/`label`/`tooltip`/`value`/`q1`/`q3`/`min`/`max`/`median`/`outliers`/`x0`/`x1` |
| `node.setAggregate({ func, quantile? })` | 设置聚合：`sum`/`avg`/`count`/`countDistinct`/`min`/`max`/`median`/`stddev`/`variance`/`quantile`                                                                                         |
| `node.setFormat(cfg)`                    | 设置格式：`{ autoFormat: true }` 或 `{ autoFormat: false, prefix, suffix, decimalCount, thousandsSeparator }`                                                                             |
| `node.setSort({ order })`                | 设置排序：`asc`/`desc`                                                                                                                                                                    |
| `node.clearFormat()`                     | 清除格式                                                                                                                                                                                  |
| `node.clearSort()`                       | 清除排序                                                                                                                                                                                  |
| `node.clearAggregate()`                  | 清除聚合（不推荐）                                                                                                                                                                        |
| `node.getId()`                           | 获取度量 ID                                                                                                                                                                               |
| `node.getField()`                        | 获取字段名                                                                                                                                                                                |

---

## 常用编码组合

| 图表类型      | 常用编码                                                     |
| ------------- | ------------------------------------------------------------ |
| 柱状图/条形图 | `yAxis`（主度量）、`xAxis`（维度）                           |
| 散点图        | `size`（度量）、`color`（维度）                              |
| 双轴图        | `primaryYAxis`（第一个度量）、`secondaryYAxis`（第二个度量） |
| 饼图          | `angle`（度量）、`color`（维度）                             |
| 雷达图        | `size`（多个度量）                                           |
| 箱线图        | `q1`/`q3`/`min`/`max`/`median`/`outliers`                    |
