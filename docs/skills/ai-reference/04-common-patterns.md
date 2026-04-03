# 4. 常见意图 → 代码模式

> 每个意图包含：用户说法示例 + 对应的代码写法。所有示例基于 `builder`（`VBIChartBuilder` 实例）。

## 4.1 创建图表

**Q: "我想要一个柱状图，X 轴是类别，Y 轴是销售额"**

```ts
builder.chartType.changeChartType('column')
builder.dimensions.add('category')
builder.measures.add('sales', (node) => {
  node.setAggregate({ func: 'sum' })
})
```

**Q: "把图表改成折线图"**

```ts
builder.chartType.changeChartType('line')
// 维度/度量配置不变，encoding 会自动重映射
```

**Q: "切换成饼图，看看各品类占比"**

```ts
builder.chartType.changeChartType('pie')
```

## 4.2 维度操作

**Q: "按月份聚合"**

```ts
// 找到日期维度，更新其聚合方式
const dateDim = builder.dimensions.find((n) => n.getField() === 'order_date')
dateDim?.setAggregate({ func: 'toMonth' })
```

**Q: "按季度聚合"**

```ts
builder.dimensions.update('dimension-id-here', (node) => {
  node.setAggregate({ func: 'toQuarter' })
})
```

**Q: "对维度排序"**

```ts
builder.dimensions.update('dimension-id-here', (node) => {
  node.setSort({ order: 'desc' })
})
```

**Q: "添加第二个维度作为颜色分组"**

```ts
builder.dimensions.add('region', (node) => {
  node.setEncoding('color')
})
```

## 4.3 度量操作

**Q: "对销售额求平均，而不是求和"**

```ts
builder.measures.update('measure-id-here', (node) => {
  node.setAggregate({ func: 'avg' })
})
```

**Q: "给度量加个单位格式"**

```ts
builder.measures.update('measure-id-here', (node) => {
  node.setFormat({ autoFormat: false, suffix: '元', decimalCount: 0 })
})
```

**Q: "添加一个副 Y 轴指标（双轴图）"**

```ts
// 先切换到双轴图
builder.chartType.changeChartType('dualAxis')
// 第一个度量走主 Y 轴
builder.measures.add('sales', (node) => {
  node.setAggregate({ func: 'sum' })
  node.setEncoding('primaryYAxis')
})
// 第二个度量走副 Y 轴
builder.measures.add('profit', (node) => {
  node.setAggregate({ func: 'avg' })
  node.setEncoding('secondaryYAxis')
})
```

## 4.4 过滤器

**Q: "只看最近 30 天的数据"**

```ts
builder.whereFilter.add('order_date', (node) => {
  node.setOperator('date')
  node.setDate({
    type: 'relative',
    mode: 'last',
    amount: 30,
    unit: 'day',
  })
})
```

**Q: "只看 2024 年的数据"**

```ts
builder.whereFilter.add('order_date', (node) => {
  node.setOperator('date')
  node.setDate({
    type: 'period',
    unit: 'year',
    year: 2024,
  })
})
```

**Q: "只看某个类别的数据"**

```ts
builder.whereFilter.add('category', (node) => {
  node.setOperator('=')
  node.setValue('电子产品')
})
```

**Q: "排除某些地区"**

```ts
builder.whereFilter.add('region', (node) => {
  node.setOperator('not in')
  node.setValue(['东北', '西北'])
})
```

**Q: "只看销售额大于 1000 的类别（HAVING）"**

```ts
builder.havingFilter.add('sales', (node) => {
  node.setAggregate({ func: 'sum' })
  node.setOperator('>')
  node.setValue(1000)
})
```

**Q: "组合 HAVING 条件"**

```ts
builder.havingFilter.addGroup('and', (group) => {
  group.add('sales', (node) => {
    node.setAggregate({ func: 'sum' })
    node.setOperator('>')
    node.setValue(5000)
  })
  group.add('profit', (node) => {
    node.setAggregate({ func: 'avg' })
    node.setOperator('>=')
    node.setValue(200)
  })
})
```

## 4.5 主题和语言

**Q: "切换到暗色主题"**

```ts
builder.theme.setTheme('dark')
```

**Q: "切换到英文"**

```ts
builder.locale.setLocale('en-US')
```

## 4.6 Undo/Redo

**Q: "撤销上一步操作"**

```ts
if (builder.undoManager.canUndo()) {
  builder.undoManager.undo()
}
```

**Q: "恢复撤销"**

```ts
if (builder.undoManager.canRedo()) {
  builder.undoManager.redo()
}
```
