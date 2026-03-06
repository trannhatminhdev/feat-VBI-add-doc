# 透视柱状图示例

透视图通过在 dimensions 中使用 `row` 或 `column` encoding 创建分面图表。

## 基础透视图

### 按行分面

```javascript
const schema = {
  chartType: "column",
  dataset: [
    { date: "2019", region: "east", category: "Grocery", sales: 100 },
    { date: "2019", region: "east", category: "Beverages", sales: 200 },
    { date: "2019", region: "west", category: "Grocery", sales: 150 },
    { date: "2019", region: "west", category: "Beverages", sales: 180 },
    { date: "2020", region: "east", category: "Grocery", sales: 120 },
    { date: "2020", region: "east", category: "Beverages", sales: 220 },
    { date: "2020", region: "west", category: "Grocery", sales: 160 },
    { date: "2020", region: "west", category: "Beverages", sales: 200 },
  ],
  dimensions: [
    { id: "category", alias: "类别", encoding: "xAxis" },
    { id: "region", alias: "区域", encoding: "row" },
  ],
  measures: [{ id: "sales", alias: "销售额", encoding: "yAxis" }],
};
```

**效果**：垂直排列两个子图，分别显示东部和西部的数据。

### 按列分面

```javascript
const schema = {
  chartType: "column",
  dataset: [
    { date: "2019", region: "east", category: "Grocery", sales: 100 },
    { date: "2019", region: "east", category: "Beverages", sales: 200 },
    { date: "2019", region: "west", category: "Grocery", sales: 150 },
    { date: "2019", region: "west", category: "Beverages", sales: 180 },
    { date: "2020", region: "east", category: "Grocery", sales: 120 },
    { date: "2020", region: "east", category: "Beverages", sales: 220 },
    { date: "2020", region: "west", category: "Grocery", sales: 160 },
    { date: "2020", region: "west", category: "Beverages", sales: 200 },
  ],
  dimensions: [
    { id: "category", alias: "类别", encoding: "xAxis" },
    { id: "date", alias: "日期", encoding: "column" },
  ],
  measures: [{ id: "sales", alias: "销售额", encoding: "yAxis" }],
};
```

**效果**：水平排列两个子图，分别显示2019年和2020年的数据。

## 复合透视图

### 行列双重分面

```javascript
const schema = {
  chartType: "column",
  dataset: [
    { date: "2019", region: "east", category: "Grocery", sales: 100 },
    { date: "2019", region: "east", category: "Beverages", sales: 200 },
    { date: "2019", region: "west", category: "Grocery", sales: 150 },
    { date: "2019", region: "west", category: "Beverages", sales: 180 },
    { date: "2020", region: "east", category: "Grocery", sales: 120 },
    { date: "2020", region: "east", category: "Beverages", sales: 220 },
    { date: "2020", region: "west", category: "Grocery", sales: 160 },
    { date: "2020", region: "west", category: "Beverages", sales: 200 },
  ],
  dimensions: [
    { id: "category", alias: "类别", encoding: "xAxis" },
    { id: "date", alias: "日期", encoding: "column" },
    { id: "region", alias: "区域", encoding: "row" },
  ],
  measures: [{ id: "sales", alias: "销售额", encoding: "yAxis" }],
};
```

**效果**：创建 2×2 网格布局，行表示区域，列表示年份。

## 时间序列透视图

### 各省份人口趋势（行透视）

```javascript
const schema = {
  chartType: "line", // 时间趋势建议用折线图
  dataset: [
    { province: "广东", year: 2020, population: 12601 },
    { province: "广东", year: 2021, population: 12684 },
    { province: "广东", year: 2022, population: 12700 },
    { province: "广东", year: 2023, population: 12720 },
    { province: "河南", year: 2020, population: 9937 },
    { province: "河南", year: 2021, population: 9883 },
    { province: "河南", year: 2022, population: 9872 },
    { province: "河南", year: 2023, population: 9870 },
    { province: "山东", year: 2020, population: 10152 },
    { province: "山东", year: 2021, population: 10169 },
    { province: "山东", year: 2022, population: 10162 },
    { province: "山东", year: 2023, population: 10123 },
  ],
  dimensions: [
    { id: "province", alias: "省份", encoding: "row" }, // 关键：每个省份一行
    { id: "year", alias: "年份", encoding: "xAxis" }, // 时间作为X轴
  ],
  measures: [
    { id: "population", alias: "人口数(万人)", encoding: "yAxis" }, // 数值作为Y轴
  ],
};
```

**效果**：垂直排列三个子图，每个子图显示一个省份的人口时间变化趋势。

### 各年份地区对比（列透视）

```javascript
const schema = {
  chartType: "column",
  dataset: [
    { region: "华北", year: 2020, gdp: 8.5 },
    { region: "华北", year: 2021, gdp: 9.2 },
    { region: "华北", year: 2022, gdp: 9.8 },
    { region: "华东", year: 2020, gdp: 12.3 },
    { region: "华东", year: 2021, gdp: 13.1 },
    { region: "华东", year: 2022, gdp: 13.9 },
    { region: "华南", year: 2020, gdp: 6.8 },
    { region: "华南", year: 2021, gdp: 7.2 },
    { region: "华南", year: 2022, gdp: 7.6 },
  ],
  dimensions: [
    { id: "region", alias: "地区", encoding: "xAxis" }, // 地区作为X轴
    { id: "year", alias: "年份", encoding: "column" }, // 关键：每年一列
  ],
  measures: [{ id: "gdp", alias: "GDP(万亿元)", encoding: "yAxis" }],
};
```

**效果**：水平排列三个子图，每个子图显示一年内各地区的GDP对比。

## 透视图使用场景

1. **多维度对比**：需要同时比较多个分类维度的数据
2. **分组分析**：按不同条件将数据分组展示
3. **趋势对比**：对比不同组别的数据趋势变化
4. **细分洞察**：深入分析数据的不同切面

## 常见透视配置错误

### ❌ 错误：混淆透视和坐标轴

```javascript
// 错误示例：想要按省份分行显示，但错误地使用了yAxis
dimensions: [
  { id: "province", encoding: "yAxis" },   // ❌ 这会让省份成为Y轴标签
  { id: "year", encoding: "xAxis" }
],
measures: [
  { id: "population", encoding: "xAxis" }  // ❌ 数值映射到X轴是错误的
]
```

### ✅ 正确：使用透视encoding

```javascript
// 正确示例：按省份分行显示
dimensions: [
  { id: "province", encoding: "row" },     // ✅ 创建行分面，每个省份一行
  { id: "year", encoding: "xAxis" }
],
measures: [
  { id: "population", encoding: "yAxis" }  // ✅ 数值映射到Y轴
]
```

### 🎯 关键区别理解

| Encoding类型 | 作用       | 使用场景     | 视觉效果           |
| ------------ | ---------- | ------------ | ------------------ |
| `row`        | 创建行分面 | "每行显示xx" | 垂直排列的多个子图 |
| `column`     | 创建列分面 | "每列显示xx" | 水平排列的多个子图 |
| `xAxis`      | X轴坐标    | 时间、类别等 | 单图内的水平轴标签 |
| `yAxis`      | Y轴坐标    | 数值、类别等 | 单图内的垂直轴标签 |

## 透视图配置要点

1. **维度选择**：通常选择具有较少唯一值的维度作为分面维度
2. **布局考虑**：行分面适合垂直对比，列分面适合水平对比
3. **数据完整性**：确保每个分面都有足够的数据点
4. **视觉清晰**：避免创建过多分面导致单个子图过小

## 支持透视的图表类型

- **column**：柱状图透视
- **bar**：条形图透视
- **line**：折线图透视
- **area**：面积图透视
- **scatter**：散点图透视
