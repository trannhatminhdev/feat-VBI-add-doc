## 动态散点图

## 完整 Schema

```javascript
const schema = {
  chartType: 'raceScatter',
  dataset: [
    {
      year: 2016,
      province: '广东',
      population: 10999,
      birth_rate: 11.85,
    },
    {
      year: 2016,
      province: '山东',
      population: 9947,
      birth_rate: 17.89,
    },
  ],
  dimensions: [
    {
      id: 'year',
      alias: '年份',
      encoding: 'player',
    },
    {
      id: 'province',
      alias: '省份',
      encoding: 'color',
    },
  ],
  measures: [
    {
      id: 'population',
      alias: '人口数量(万人)',
      encoding: 'xAxis',
    },
    {
      id: 'birth_rate',
      alias: '出生率(‰)',
      encoding: 'yAxis',
    },
  ],
}
```
