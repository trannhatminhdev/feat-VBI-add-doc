### RaceColumnDimension
第一个维度映射到player，第二个维度映射到X轴
```typescript
export type RaceColumnDimension = BaseDimension & {
  /**
   * @description 维度映射的通道
   * - xAxis: 支持将多个维度映射到x轴
   * - color: 支持将多个维度映射到颜色通道
   * - detail: 支持将多个维度映射到详情通道
   * - tooltip: 支持将多个维度映射到提示通道
   * - label: 支持将多个维度映射到标签通道
   * - row: 支持将多个维度映射到行通道
   * - column: 支持将多个维度映射到列通道
   * - player: 支持将多个维度映射到播放器通道
   */
  encoding?: 'xAxis' | 'color' | 'detail' | 'tooltip' | 'label' | 'row' | 'column' | 'player'
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