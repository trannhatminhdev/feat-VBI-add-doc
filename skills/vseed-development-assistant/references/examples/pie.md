# 基础饼图

## 应用场景

展示整体中各部分的占比构成。

## 完整 Schema

```javascript
const schema = {
  chartType: "pie",
  dataset: [
    { category: "类目A", value: 300 },
    { category: "类目B", value: 250 },
    { category: "类目C", value: 200 },
    { category: "类目D", value: 150 },
    { category: "类目E", value: 100 },
  ],
  dimensions: [{ id: "category", encoding: "color" }],
  measures: [{ id: "value", alias: "数值", encoding: "angle" }],
};
```

## 配置说明

- `chartType: 'pie'`：饼图类型
- `dimensions`：类目字段映射到颜色通道（饼图默认）
- `measures`：数值字段映射到角度（扇区大小）

---

# 环形图

## 应用场景

饼图的变体，中心可展示关键指标或留白。

## 完整 Schema

```javascript
const schema = {
  chartType: "donut",
  dataset: [
    { category: "类目A", value: 300 },
    { category: "类目B", value: 250 },
    { category: "类目C", value: 200 },
    { category: "类目D", value: 150 },
    { category: "类目E", value: 100 },
  ],
  dimensions: [{ id: "category", encoding: "color" }],
  measures: [{ id: "value", alias: "数值", encoding: "angle" }],
};
```

## 配置说明

- `chartType: 'donut'`：环形图类型
- 与饼图配置相同，但会自动生成中心空白区域

---

# 带标签饼图

## 应用场景

在扇区上显示标签和百分比。

## 完整 Schema

```javascript
const schema = {
  chartType: "pie",
  dataset: [
    { category: "类目A", value: 300 },
    { category: "类目B", value: 250 },
    { category: "类目C", value: 200 },
    { category: "类目D", value: 150 },
    { category: "类目E", value: 100 },
  ],
  dimensions: [{ id: "category", encoding: "color" }],
  measures: [{ id: "value", alias: "数值", encoding: "angle" }],
  label: {
    visible: true,
    position: "outside",
  },
};
```

## 配置说明

- `label.visible: true`：显示数据标签
- `label.position: 'outside'`：标签显示在扇区外部（可选 'inside'）
