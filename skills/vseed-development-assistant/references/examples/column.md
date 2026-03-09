# 基础柱状图

## 应用场景

展示不同类目之间数值的大小对比。

## 完整 Schema

```javascript
const schema = {
  chartType: 'column',
  dataset: [
    { city: '北京', sales: 1200 },
    { city: '上海', sales: 1500 },
    { city: '广州', sales: 980 },
    { city: '深圳', sales: 1100 },
    { city: '杭州', sales: 850 },
  ],
  dimensions: [{ id: 'city', encoding: 'xAxis' }],
  measures: [{ id: 'sales', alias: '销售额', encoding: 'yAxis' }],
}
```

## 配置说明

- `chartType: 'column'`：柱状图类型
- `dimensions`：城市字段映射到 X 轴（默认 encoding）
- `measures`：销售额字段映射到 Y 轴

---

# 分组柱状图

## 应用场景

按多个维度分组展示数据对比。

## 完整 Schema

```javascript
const schema = {
  chartType: 'column',
  dataset: [
    { city: '北京', quarter: 'Q1', sales: 1200 },
    { city: '北京', quarter: 'Q2', sales: 1400 },
    { city: '上海', quarter: 'Q1', sales: 1500 },
    { city: '上海', quarter: 'Q2', sales: 1600 },
    { city: '广州', quarter: 'Q1', sales: 980 },
    { city: '广州', quarter: 'Q2', sales: 1100 },
  ],
  dimensions: [
    { id: 'city', encoding: 'xAxis' },
    { id: 'quarter', encoding: 'color' },
  ],
  measures: [{ id: 'sales', alias: '销售额', encoding: 'yAxis' }],
}
```

## 配置说明

- `dimensions[0]`：城市字段映射到 X 轴
- `dimensions[1]`：季度字段映射到颜色通道，实现分组效果
- `measures`：销售额字段映射到 Y 轴

---

# 带标签柱状图

## 应用场景

在柱子上显示数值标签。

## 完整 Schema

```javascript
const schema = {
  chartType: 'column',
  dataset: [
    { city: '北京', sales: 1200 },
    { city: '上海', sales: 1500 },
    { city: '广州', sales: 980 },
    { city: '深圳', sales: 1100 },
    { city: '杭州', sales: 850 },
  ],
  dimensions: [{ id: 'city', encoding: 'xAxis' }],
  measures: [{ id: 'sales', alias: '销售额', encoding: 'yAxis' }],
  label: {
    visible: true,
    position: 'top',
  },
}
```

## 配置说明

- `label.visible: true`：显示数据标签
- `label.position: 'top'`：标签显示在柱子顶部
