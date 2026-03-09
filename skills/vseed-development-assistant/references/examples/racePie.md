# 动态饼图

## 应用场景

A dynamic pie chart race animation showing ranking changes over time.

## 完整Schema

```javascript
const schema = {
  chartType: 'racePie',
  measures: [
    {
      id: 'sales',
      alias: '销售额(万元)',
      autoFormat: true,
      encoding: 'angle',
    },
  ],
  dimensions: [
    {
      id: 'date',
      alias: '年份',
      encoding: 'player',
    },
    {
      id: 'category',
      alias: '商品分类',
      encoding: 'color',
    },
  ],
  dataset: [
    {
      date: '1990',
      category: '电子产品',
      sales: 119,
    },
  ],
}
```
