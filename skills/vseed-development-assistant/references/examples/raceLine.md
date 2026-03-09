# 动态线图

## 应用场景

动态展示趋势图

## 完整Schema

```javascript
const schema = {
  chartType: 'raceLine',
  measures: [
    {
      id: 'sales',
      alias: '销售额(万元)',
      autoFormat: true,
      encoding: 'yAxis',
    },
  ],
  dimensions: [
    {
      id: 'date',
      alias: '年份',
      encoding: 'xAxis',
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
