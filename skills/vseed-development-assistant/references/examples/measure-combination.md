# 度量组合图示例

度量组合图通过在 measures 中使用不同的 `parentId` 将度量分配到不同的子图中，实现复合图表效果。

## 双度量组合

```javascript
const schema = {
  chartType: "column",
  dataset: [
    { date: "2019", sales: 100, profit: 20, rate: 0.2 },
    { date: "2020", sales: 120, profit: 30, rate: 0.25 },
    { date: "2021", sales: 150, profit: 45, rate: 0.3 },
    { date: "2022", sales: 180, profit: 54, rate: 0.3 },
    { date: "2023", sales: 200, profit: 70, rate: 0.35 },
  ],
  dimensions: [{ id: "date", alias: "年份" }],
  measures: [
    {
      id: "sales",
      alias: "销售额",
      parentId: "group1",
    },
    {
      id: "profit",
      alias: "利润",
      parentId: "group1",
    },
    {
      id: "rate",
      alias: "利润率",
      parentId: "group2",
    },
  ],
};
```

**效果**：创建两个子图，第一个显示销售额和利润的柱状图，第二个显示利润率的柱状图。

## 地区 × 产品 × 多指标组合

```javascript
const schema = {
  chartType: "column",
  dataset: [
    {
      region: "华北",
      product: "产品A",
      revenue: 1000,
      cost: 600,
      units: 50,
    },
    {
      region: "华北",
      product: "产品B",
      revenue: 800,
      cost: 500,
      units: 40,
    },
    {
      region: "华东",
      product: "产品A",
      revenue: 1200,
      cost: 700,
      units: 60,
    },
    {
      region: "华东",
      product: "产品B",
      revenue: 900,
      cost: 550,
      units: 45,
    },
    {
      region: "华南",
      product: "产品A",
      revenue: 1100,
      cost: 650,
      units: 55,
    },
    {
      region: "华南",
      product: "产品B",
      revenue: 950,
      cost: 580,
      units: 48,
    },
  ],
  dimensions: [
    { id: "region", alias: "地区" },
    { id: "product", alias: "产品", encoding: "color" },
  ],
  measures: [
    {
      id: "revenue",
      alias: "收入",
      parentId: "financial",
    },
    {
      id: "cost",
      alias: "成本",
      parentId: "financial",
    },
    {
      id: "units",
      alias: "销量",
      parentId: "quantity",
    },
  ],
};
```

**效果**：创建两个子图，第一个按地区和产品显示收入和成本，第二个显示销量。

## 区域透视 × 指标组合

```javascript
const schema = {
  chartType: "column",
  dataset: [
    {
      date: "2019",
      region: "east",
      category: "Grocery",
      profit: 10,
      sales: 100,
    },
    {
      date: "2019",
      region: "east",
      category: "Beverages",
      profit: 30,
      sales: 200,
    },
    {
      date: "2019",
      region: "west",
      category: "Grocery",
      profit: 15,
      sales: 150,
    },
    {
      date: "2019",
      region: "west",
      category: "Beverages",
      profit: 25,
      sales: 180,
    },
    {
      date: "2020",
      region: "east",
      category: "Grocery",
      profit: 12,
      sales: 120,
    },
    {
      date: "2020",
      region: "east",
      category: "Beverages",
      profit: 35,
      sales: 220,
    },
    {
      date: "2020",
      region: "west",
      category: "Grocery",
      profit: 18,
      sales: 160,
    },
    {
      date: "2020",
      region: "west",
      category: "Beverages",
      profit: 28,
      sales: 200,
    },
  ],
  dimensions: [
    { id: "category", alias: "类别" },
    { id: "date", alias: "日期", encoding: "column" },
    { id: "region", alias: "区域", encoding: "row" },
  ],
  measures: [
    {
      id: "sales",
      alias: "销售额",
      parentId: "sales-and-profit",
    },
    {
      id: "profit",
      alias: "利润",
      parentId: "sales-and-profit",
    },
  ],
};
```

**效果**：创建 2×2 透视网格，每个网格内同时显示销售额和利润。

## 组合图使用场景

1. **多指标对比**：需要同时分析不同量纲的指标
2. **主副指标**：主要指标和辅助指标的关联分析
3. **业务复合分析**：收入成本、数量金额等业务指标组合
4. **趋势 + 比率**：绝对值趋势与相对比率的结合展示

## 组合图配置要点

1. **parentId 命名**：使用语义化的ID，便于理解图表结构
2. **指标选择**：选择相关性强的指标进行组合
3. **数据尺度**：注意不同指标的数值范围差异
4. **视觉平衡**：确保各子图的视觉权重合理

## 组合图最佳实践

1. **同类指标组合**：将同一业务领域的指标放在同一个 `parentId` 下
2. **避免过度组合**：通常 2-4 个子图为宜，避免信息过载
3. **保持数据一致性**：确保所有度量字段在 dataset 中都有对应数据
4. **合理命名**：`parentId` 和 `alias` 要能清楚表达业务含义

## 支持度量组合的图表类型

- **column**：柱状图组合
- **bar**：条形图组合
- **line**：折线图组合
- **area**：面积图组合
- **scatter**：散点图组合
