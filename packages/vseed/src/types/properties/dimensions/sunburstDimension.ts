import type { BaseDimension } from './baseDimension'

export type SunburstDimension = BaseDimension & {
  /**
   * @description 维度映射的通道
   * - hierarchy: 支持将多个维度映射到层级通道
   * - color: 支持将多个维度映射到颜色通道
   * - label: 支持将多个维度映射到标签通道
   * - tooltip: 支持将多个维度映射到提示通道
   */
  encoding?: 'hierarchy' | 'color' | 'label' | 'tooltip'
}
