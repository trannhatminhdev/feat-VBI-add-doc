import type { BaseDimension } from './baseDimension'

export type HierarchyDimension = BaseDimension & {
  /**
   * @description 维度映射的通道
   * - hierarchy: 支持将多个维度映射到层级通道
   * - label: 支持将多个维度映射到标签通道
   * - tooltip: 支持将多个维度映射到提示通道
   * @tip 第一个维度会被直接映射到 color 通道
   */
  encoding?: 'hierarchy' | 'label' | 'tooltip'
}
