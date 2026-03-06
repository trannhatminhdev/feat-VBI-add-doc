# 基础条形图

## 应用场景

横向展示类目数据对比，适合类目标签较长的情况。

## 完整 Schema

```javascript
const schema = {
  chartType: "bar",
  dataset: [
    { product: "智能手机", sales: 2500 },
    { product: "笔记本电脑", sales: 1800 },
    { product: "平板电脑", sales: 1200 },
    { product: "智能手表", sales: 800 },
    { product: "无线耳机", sales: 1500 },
  ],
  dimensions: [{ id: "product", encoding: "yAxis" }],
  measures: [{ id: "sales", alias: "销售额", encoding: "xAxis" }],
};
```

## 配置说明

- `chartType: 'bar'`：条形图类型（横向柱状图）
- `dimensions`：产品字段映射到 Y 轴（条形图默认）
- `measures`：销售额字段映射到 X 轴

---

# 分组条形图

## 应用场景

按多个维度分组展示横向数据对比。

## 完整 Schema

```javascript
const schema = {
  chartType: "bar",
  dataset: [
    { product: "智能手机", region: "华北", sales: 2500 },
    { product: "智能手机", region: "华东", sales: 2800 },
    { product: "笔记本电脑", region: "华北", sales: 1800 },
    { product: "笔记本电脑", region: "华东", sales: 2100 },
    { product: "平板电脑", region: "华北", sales: 1200 },
    { product: "平板电脑", region: "华东", sales: 1400 },
  ],
  dimensions: [
    { id: "product", encoding: "yAxis" },
    { id: "region", encoding: "color" },
  ],
  measures: [{ id: "sales", alias: "销售额", encoding: "xAxis" }],
};
```

## 配置说明

- `dimensions[0]`：产品字段映射到 Y 轴
- `dimensions[1]`：地区字段映射到颜色通道，实现分组效果
- `measures`：销售额字段映射到 X 轴
