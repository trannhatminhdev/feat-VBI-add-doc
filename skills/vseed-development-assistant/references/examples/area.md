# 基础面积图

## 应用场景

展示数据随时间的变化趋势，强调累积量感。

## 完整 Schema

```javascript
const schema = {
  chartType: "area",
  dataset: [
    { month: "1月", value: 120 },
    { month: "2月", value: 150 },
    { month: "3月", value: 180 },
    { month: "4月", value: 160 },
    { month: "5月", value: 200 },
    { month: "6月", value: 220 },
  ],
  dimensions: [{ id: "month", encoding: "xAxis" }],
  measures: [{ id: "value", alias: "数值", encoding: "yAxis" }],
};
```

## 配置说明

- `chartType: 'area'`：面积图类型
- `dimensions`：月份字段映射到 X 轴
- `measures`：数值字段映射到 Y 轴

---

# 堆叠面积图

## 应用场景

展示多组数据的累积趋势，强调整体与部分的关系。

## 完整 Schema

```javascript
const schema = {
  chartType: "area",
  dataset: [
    { month: "1月", category: "产品A", value: 120 },
    { month: "1月", category: "产品B", value: 80 },
    { month: "1月", category: "产品C", value: 60 },
    { month: "2月", category: "产品A", value: 150 },
    { month: "2月", category: "产品B", value: 100 },
    { month: "2月", category: "产品C", value: 70 },
    { month: "3月", category: "产品A", value: 180 },
    { month: "3月", category: "产品B", value: 120 },
    { month: "3月", category: "产品C", value: 80 },
    { month: "4月", category: "产品A", value: 160 },
    { month: "4月", category: "产品B", value: 110 },
    { month: "4月", category: "产品C", value: 90 },
    { month: "5月", category: "产品A", value: 200 },
    { month: "5月", category: "产品B", value: 130 },
    { month: "5月", category: "产品C", value: 100 },
    { month: "6月", category: "产品A", value: 220 },
    { month: "6月", category: "产品B", value: 140 },
    { month: "6月", category: "产品C", value: 110 },
  ],
  dimensions: [
    { id: "month", encoding: "xAxis" },
    { id: "category", encoding: "color" },
  ],
  measures: [{ id: "value", alias: "数值", encoding: "yAxis" }],
};
```

## 配置说明

- `dimensions[0]`：月份字段映射到 X 轴
- `dimensions[1]`：类目字段映射到颜色通道，实现堆叠效果
- `measures`：数值字段映射到 Y 轴

---

# 百分比面积图

## 应用场景

展示各部分占总体的百分比变化趋势。

## 完整 Schema

```javascript
const schema = {
  chartType: "areaPercent",
  dataset: [
    { month: "1月", category: "产品A", value: 120 },
    { month: "1月", category: "产品B", value: 80 },
    { month: "1月", category: "产品C", value: 60 },
    { month: "2月", category: "产品A", value: 150 },
    { month: "2月", category: "产品B", value: 100 },
    { month: "2月", category: "产品C", value: 70 },
    { month: "3月", category: "产品A", value: 180 },
    { month: "3月", category: "产品B", value: 120 },
    { month: "3月", category: "产品C", value: 80 },
  ],
  dimensions: [
    { id: "month", encoding: "xAxis" },
    { id: "category", encoding: "color" },
  ],
  measures: [{ id: "value", alias: "数值", encoding: "yAxis" }],
};
```

## 配置说明

- `chartType: 'areaPercent'`：百分比面积图类型
- 数值会自动归一化为 100%
