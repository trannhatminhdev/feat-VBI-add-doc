import type { BaseMeasure } from './baseMeasure'

export type HierarchyMeasure = BaseMeasure & {
  /**
   * @description 指标映射的通道
   * - size: 指标映射到大小通道，用于树图等图表的面积或大小展示
   * - label: 指标映射的标签
   * - tooltip: 指标映射的提示
   */
  encoding?: 'size' | 'label' | 'tooltip'
}
