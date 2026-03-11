# 基础折线图

## 应用场景

展示数据随时间或顺序的变化趋势。

## 完整 Schema

```javascript
const schema = {
  chartType: 'line',
  dataset: [
    { month: '1月', value: 120 },
    { month: '2月', value: 150 },
    { month: '3月', value: 180 },
    { month: '4月', value: 160 },
    { month: '5月', value: 200 },
    { month: '6月', value: 220 },
  ],
  dimensions: [{ id: 'month', encoding: 'xAxis' }],
  measures: [{ id: 'value', alias: '数值', encoding: 'yAxis' }],
}
```

## 配置说明

- `chartType: 'line'`：折线图类型
- `dimensions`：月份字段映射到 X 轴
- `measures`：数值字段映射到 Y 轴

---

# 多系列折线图

## 应用场景

展示多组数据的趋势对比。

## 完整 Schema

```javascript
const schema = {
  chartType: 'line',
  dataset: [
    { month: '1月', category: '产品A', value: 120 },
    { month: '1月', category: '产品B', value: 100 },
    { month: '2月', category: '产品A', value: 150 },
    { month: '2月', category: '产品B', value: 130 },
    { month: '3月', category: '产品A', value: 180 },
    { month: '3月', category: '产品B', value: 160 },
    { month: '4月', category: '产品A', value: 160 },
    { month: '4月', category: '产品B', value: 180 },
    { month: '5月', category: '产品A', value: 200 },
    { month: '5月', category: '产品B', value: 190 },
    { month: '6月', category: '产品A', value: 220 },
    { month: '6月', category: '产品B', value: 210 },
  ],
  dimensions: [
    { id: 'month', encoding: 'xAxis' },
    { id: 'category', encoding: 'color' },
  ],
  measures: [{ id: 'value', alias: '数值', encoding: 'yAxis' }],
}
```

## 配置说明

- `dimensions[0]`：月份字段映射到 X 轴
- `dimensions[1]`：类目字段映射到颜色通道，生成多条折线
- `measures`：数值字段映射到 Y 轴

---

# 带数据点折线图

## 应用场景

在折线上显示数据点，便于查看具体数值。

## 完整 Schema

```javascript
const schema = {
  chartType: 'line',
  dataset: [
    { month: '1月', value: 120 },
    { month: '2月', value: 150 },
    { month: '3月', value: 180 },
    { month: '4月', value: 160 },
    { month: '5月', value: 200 },
    { month: '6月', value: 220 },
  ],
  dimensions: [{ id: 'month', encoding: 'xAxis' }],
  measures: [{ id: 'value', alias: '数值', encoding: 'yAxis' }],
  pointStyle: {
    size: 6,
    fill: '#fff',
    stroke: '#1890ff',
    lineWidth: 2,
  },
  label: {
    visible: true,
    position: 'top',
  },
}
```

## 配置说明

- `pointStyle`：配置数据点的样式
- `label.visible: true`：显示数据标签
