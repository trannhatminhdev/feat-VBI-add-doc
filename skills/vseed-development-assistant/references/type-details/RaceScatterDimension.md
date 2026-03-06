### RaceScatterDimension
维度，用于区分不同的数据系列和进行图例展示
```typescript
export type RaceScatterDimension = BaseDimension & {
  /**
   * @description 竞赛散点图类图表中的维度映射的通道
   * - color: 支持将多个维度映射到颜色通道
   * - detail: 支持将多个维度映射到详情通道
   * - tooltip: 支持将多个维度映射到提示通道
   * - label: 支持将多个维度映射到标签通道
   * - row: 支持将多个维度映射到行通道
   * - column: 支持将多个维度映射到列通道
   * - player: 支持将多个维度映射到播放器通道
   */
  encoding?: 'color' | 'detail' | 'tooltip' | 'label' | 'row' | 'column' | 'player'
}

export type BaseDimension = {
  /**
   * 维度对应的字段id
   */
  id: string
  /**
   * 维度别名
   */
  alias?: string
}


```