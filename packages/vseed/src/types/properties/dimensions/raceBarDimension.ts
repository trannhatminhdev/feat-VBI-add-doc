import type { BaseDimension } from './baseDimension'

export type RaceBarDimension = BaseDimension & {
  /**
   * @description 维度映射的通道
   * - player: 支持将多个维度映射到播放通道
   * - yAxis: 支持将多个维度映射到y轴
   * - color: 支持将多个维度映射到颜色通道
   * - detail: 支持将多个维度映射到详情通道
   * - tooltip: 支持将多个维度映射到提示通道
   * - label: 支持将多个维度映射到标签通道
   * - row: 支持将多个维度映射到行通道
   * - column: 支持将多个维度映射到列通道
   */
  encoding?: 'player' | 'yAxis' | 'color' | 'detail' | 'tooltip' | 'label' | 'row' | 'column'
}

export type RaceBarParallelDimension = RaceBarDimension
export type RaceBarPercentDimension = RaceBarDimension
