# ADR-001: VBI Measure and Dimension Encoding

## Status

Proposed

## Context

VSeed 的指标（Measure）和维度（Dimension）支持 encoding 设计，允许用户将数据字段映射到不同的视觉通道。VBI 需要在 builder 层支持这一功能，使用户能够：

1. 根据图表类型获取支持的 encoding 类型
2. 在添加维度/指标时自动设置默认 encoding
3. 动态修改维度/指标的 encoding
4. 在 buildVSeed 时正确应用 encoding

### VSeed Encoding 类型定义

**Dimension Encoding:**

```typescript
type DimensionEncoding =
  | 'xAxis' // X轴
  | 'yAxis' // Y轴
  | 'angle' // 角度通道
  | 'color' // 颜色通道
  | 'detail' // 详情通道
  | 'tooltip' // 提示通道
  | 'label' // 标签通道
  | 'row' // 行通道
  | 'column' // 列通道
  | 'player' // 播放轴通道
  | 'hierarchy' // 层级通道
```

**Measure Encoding:**

```typescript
type MeasureEncoding =
  | 'primaryYAxis' // 主Y轴
  | 'secondaryYAxis' // 副Y轴
  | 'xAxis' // X轴
  | 'yAxis' // Y轴
  | 'angle' // 角度通道
  | 'radius' // 半径通道
  | 'size' // 大小通道
  | 'color' // 颜色通道
  | 'detail' // 详情通道
  | 'column' // 列通道
  | 'label' // 标签通道
  | 'tooltip' // 提示通道
  | 'value' // 值通道
  | 'q1'
  | 'median'
  | 'q3' // 箱线图四分位
  | 'min'
  | 'max' // 箱线图极值
  | 'outliers' // 箱线图异常值
  | 'x0'
  | 'x1' // 箱线图范围
```

### 各图表类型支持的 Dimension Encoding

| 图表类型    | 支持的 Dimension Encoding                                       |
| ----------- | --------------------------------------------------------------- |
| PivotTable  | `row`, `column`                                                 |
| Table       | `column`                                                        |
| Line        | `xAxis`, `color`, `detail`, `tooltip`, `label`, `row`, `column` |
| Column      | `xAxis`, `color`, `detail`, `tooltip`, `label`, `row`, `column` |
| Bar         | `yAxis`, `color`, `detail`, `tooltip`, `label`, `row`, `column` |
| Pie         | `color`, `detail`, `tooltip`, `label`, `row`, `column`          |
| Donut       | `color`, `detail`, `tooltip`, `label`, `row`, `column`          |
| Scatter     | `color`, `detail`, `tooltip`, `label`, `row`, `column`          |
| Rose        | `angle`, `color`, `detail`, `tooltip`, `label`, `row`, `column` |
| Radar       | `angle`, `color`, `detail`, `tooltip`, `label`, `row`, `column` |
| Heatmap     | `color`, `tooltip`                                              |
| Funnel      | `color`, `label`, `tooltip`                                     |
| Histogram   | `xAxis`, `color`, `tooltip`, `label`                            |
| BoxPlot     | `color`, `tooltip`, `label`                                     |
| DualAxis    | `xAxis`, `color`, `detail`, `tooltip`, `label`                  |
| Hierarchy   | `hierarchy`                                                     |
| RaceColumn  | `player`, `color`, `detail`, `tooltip`, `label`                 |
| RaceBar     | `player`, `color`, `detail`, `tooltip`, `label`                 |
| RaceLine    | `player`, `color`, `detail`, `tooltip`, `label`                 |
| RacePie     | `player`, `color`, `detail`, `tooltip`, `label`                 |
| RaceDonut   | `player`, `color`, `detail`, `tooltip`, `label`                 |
| RaceScatter | `player`, `color`, `detail`, `tooltip`, `label`                 |

### 各图表类型支持的 Measure Encoding

| 图表类型                      | 支持的 Measure Encoding                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| PivotTable                    | `detail`                                                           |
| Table                         | `column`                                                           |
| Line                          | `yAxis`, `color`, `detail`, `label`, `tooltip`                     |
| Column                        | `yAxis`, `color`, `label`, `tooltip`                               |
| Bar                           | `xAxis`, `color`, `label`, `tooltip`                               |
| Pie                           | `angle`, `color`, `label`, `tooltip`                               |
| Donut                         | `angle`, `radius`, `color`, `label`, `tooltip`                     |
| Scatter                       | `xAxis`, `yAxis`, `size`, `color`, `label`, `tooltip`              |
| Rose                          | `angle`, `color`, `label`, `tooltip`                               |
| Radar                         | `angle`, `color`, `label`, `tooltip`                               |
| Heatmap                       | `color`, `label`, `tooltip`                                        |
| Funnel                        | `label`, `tooltip`                                                 |
| Histogram                     | `label`, `tooltip`                                                 |
| BoxPlot                       | `q1`, `median`, `q3`, `min`, `max`, `outliers`, `label`, `tooltip` |
| DualAxis                      | `primaryYAxis`, `secondaryYAxis`, `color`, `label`, `tooltip`      |
| Hierarchy                     | `label`, `tooltip`                                                 |
| Area                          | `yAxis`, `color`, `label`, `tooltip`                               |
| RaceColumn/Bar/Line/Pie/Donut | `label`, `tooltip`                                                 |
| RaceScatter                   | `size`, `label`, `tooltip`                                         |

## Decision

### 1. builder.chartType 增加获取支持 encoding 的方法

```typescript
// 获取支持的维度 encoding 类型
builder.chartType.getSupportedDimensionEncodings(): DimensionEncoding[]

// 获取支持的指标 encoding 类型
builder.chartType.getSupportedMeasureEncodings(): MeasureEncoding[]
```

### 2. Dimension Node 增加 getEncoding / setEncoding 方法

```typescript
interface DimensionNode {
  getEncoding(): DimensionEncoding | undefined
  setEncoding(encoding: DimensionEncoding): void
}
```

### 3. Measure Node 增加 getEncoding / setEncoding 方法

```typescript
interface MeasureNode {
  getEncoding(): MeasureEncoding | undefined
  setEncoding(encoding: MeasureEncoding): void
}
```

### 4. buildVSeed 时正确应用 encoding

VSeed 的 encoding pipe 已经实现了根据 dimension.encoding / measure.encoding 生成正确的 Encoding 对象。VBI 需要确保：

1. 当用户设置 encoding 时，传递到 VSeed 的 dimension/measure 对象包含 encoding 属性
2. VSeed 的 `encodingFor*` 函数会自动处理用户自定义 encoding

### 5. builder.dimensions.addDimension / builder.measures.add 自动设置默认 encoding

```typescript
// 根据图表类型获取建议的默认维度 encoding
builder.chartType.getDefaultDimensionEncoding(): DimensionEncoding

// 根据图表类型获取建议的默认指标 encoding
builder.chartType.getDefaultMeasureEncoding(): MeasureEncoding
```

添加维度/指标时，自动调用此方法设置默认 encoding。

### 6. Demo 项目 shelf 组件增加 encoding 下拉菜单

在 dimensions 和 measures 的 shelf item 上增加 encoding 下拉选择器。

## Consequences

### Positive

- 用户可以为维度/指标选择不同的视觉通道映射
- 自动设置默认 encoding，简化用户操作
- 与 VSeed 的 encoding 设计保持一致

### Negative

- 需要在多个地方添加 encoding 相关逻辑
- 需要更新 Demo 项目的 UI

## Reference

- VSeed Encoding 实现: `packages/vseed/src/pipeline/advanced/chart/pipes/encoding/`
- VSeed Table Encoding 实现: `packages/vseed/src/pipeline/advanced/table/pipes/encoding/`
- VSeed Dimension 类型: `packages/vseed/src/types/properties/dimensions/`
- VSeed Encoding 类型: `packages/vseed/src/types/properties/encoding/`
