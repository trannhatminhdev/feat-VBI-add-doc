# 动态条形图

## 应用场景

展示数据随时间的动态变化，通过排序动画强调不同类别的排名变化和竞争关系。适用于观察多个对象在时间序列中的相对位置演变，如地区经济指标、销售排名等。

## 完整 Schema

```javascript
const schema = {
  chartType: "raceBar",
  dataset: [
    {
      year: 2016,
      province: "广东",
      population: 10999,
    },
  ],
  dimensions: [
    {
      id: "year",
      alias: "年份",
      encoding: "player",
    },
    {
      id: "province",
      alias: "省份",
      encoding: "xAxis",
    },
    {
      id: "province",
      alias: "省份",
      encoding: "color",
    },
  ],
  measures: [
    {
      id: "population",
      alias: "人口数量(万人)",
      encoding: "yAxis",
    },
  ],
};
```
