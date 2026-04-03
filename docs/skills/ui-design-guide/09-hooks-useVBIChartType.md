# 9. useVBIChartType — 图表类型管理

## 签名

```ts
const {
  chartType, // string，当前图表类型
  changeChartType, // (type: string) => void
  getAvailableChartTypes, // () => string[]，获取所有可用类型
} = useVBIChartType(builder)
```

## 源码

`practices/standard/src/hooks/useVBIChartType.ts`

## 用法示例

### 切换图表类型

```ts
// 切换到柱状图
changeChartType('column')

// 切换到饼图
changeChartType('pie')

// 切换到数据表格
changeChartType('table')
```

### 获取可用类型列表

```ts
const types = getAvailableChartTypes()
console.log('支持的图表类型:', types)
```

---

## 图表类型分类

| 分类 | 类型                                                                                        |
| ---- | ------------------------------------------------------------------------------------------- |
| 表格 | `table`、`pivotTable`                                                                       |
| 对比 | `column`、`columnParallel`、`columnPercent`、`bar`、`barParallel`、`barPercent`、`dualAxis` |
| 趋势 | `line`、`area`、`areaPercent`                                                               |
| 占比 | `pie`、`donut`、`rose`、`roseParallel`、`funnel`                                            |
| 分布 | `scatter`、`heatmap`、`boxPlot`、`histogram`、`radar`                                       |
| 层级 | `treeMap`、`sunburst`、`circlePacking`                                                      |
| 动态 | `raceBar`、`raceColumn`、`raceLine`、`raceScatter`、`racePie`、`raceDonut`                  |

---

## 实现细节

- 状态订阅使用 `builder.dsl.observe()`，监听 `chartType` 字段变化
- `changeChartType` 直接调用 `builder.chartType.changeChartType(type)`，无需事务封装
- 初始值从 `builder.chartType.getChartType()` 同步

---

## 注意事项

- 切换图表类型后，VSeed 会自动重新构建并触发图表渲染更新
- 部分图表类型对编码有要求（如 boxPlot 需要 q1/q3/min/max/median），VSeed 会自动补全
- 推荐使用 `ChartTypeSelector` 组件（见 component-patterns）进行类型选择，而非直接调用此 hook
