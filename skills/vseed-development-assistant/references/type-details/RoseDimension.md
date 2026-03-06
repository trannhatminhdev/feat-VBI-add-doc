### RoseDimension
```typescript
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

export type RoseDimension = RadarDimension
export type RoseParallelDimension = RadarDimension

export type RadarDimension = BaseDimension & {
  /**
   * @description 维度映射的通道
   * - angle: 支持将多个维度映射到角度通道
   * - color: 支持将多个维度映射到颜色通道
   * - detail: 支持将多个维度映射到详情通道
   * - tooltip: 支持将多个维度映射到提示通道
   * - label: 支持将多个维度映射到标签通道
   * - row: 支持将多个维度映射到行通道
   * - column: 支持将多个维度映射到列通道
   */
  encoding?: 'angle' | 'color' | 'detail' | 'tooltip' | 'label' | 'row' | 'column'
}
```