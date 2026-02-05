import { type Locale } from '../../i18n'
import type {
  BarDimension,
  BarMaxWidth,
  BarMeasure,
  DimensionLinkage,
  Sort,
  SortLegend,
  Player,
} from '../../properties'

import {
  type AnnotationArea,
  type AnnotationHorizontalLine,
  type AnnotationPoint,
  type AnnotationVerticalLine,
  type BackgroundColor,
  type Brush,
  type BarStyle,
  type Color,
  type CrosshairRect,
  type Dataset,
  type Label,
  type Legend,
  type StackCornerRadius,
  type Theme,
  type Tooltip,
  type XLinearAxis,
  type YBandAxis,
  type Page,
} from '../../properties'

/**
 * @description 动态条形图 (Race Bar Chart)
 * 适用于展示数据随时间变化的排名情况
 */
export interface RaceBar {
  /**
   * @description 动态条形图，适用于展示数据随时间变化的排名情况
   * @type {'raceBar'}
   */
  chartType: 'raceBar'

  /**
   * @description 数据源
   */
  dataset: Dataset

  /**
   * @description 维度
   */
  dimensions?: BarDimension[]

  /**
   * @description 指标
   */
  measures?: BarMeasure[]

  /**
   * @description 播放器配置, 用于指定时间维度, 动态条形图的核心配置
   */
  player?: Player

  /**
   * @description 排序配置, 动态条形图通常需要根据数值动态排序
   */
  sort?: Sort

  /**
   * @description 分页配置
   */
  page?: Page

  /**
   * @description 背景颜色
   */
  backgroundColor?: BackgroundColor

  /**
   * @description 颜色配置
   */
  color?: Color

  /**
   * @description 标签配置
   */
  label?: Label

  /**
   * @description 图例配置
   */
  legend?: Legend

  /**
   * @description 提示信息配置
   */
  tooltip?: Tooltip

  /**
   * @description 框选配置
   */
  brush?: Brush

  /**
   * @description x轴配置
   */
  xAxis?: XLinearAxis

  /**
   * @description y轴配置
   */
  yAxis?: YBandAxis

  /**
   * @description 水平提示框配置
   */
  crosshairRect?: CrosshairRect

  /**
   * @description 堆叠圆角
   */
  stackCornerRadius?: StackCornerRadius

  /**
   * @description 矩形的最大高度
   */
  barMaxWidth?: BarMaxWidth

  /**
   * @description 图例排序配置
   */
  sortLegend?: SortLegend

  /**
   * @description 主题
   */
  theme?: Theme

  /**
   * @description 条形图样式配置
   */
  barStyle?: BarStyle | BarStyle[]

  /**
   * @description 标注点配置
   */
  annotationPoint?: AnnotationPoint | AnnotationPoint[]

  /**
   * @description 数值标注线
   */
  annotationVerticalLine?: AnnotationVerticalLine | AnnotationVerticalLine[]

  /**
   * @description 维度值标注线
   */
  annotationHorizontalLine?: AnnotationHorizontalLine | AnnotationHorizontalLine[]

  /**
   * @description 标注区域配置
   */
  annotationArea?: AnnotationArea | AnnotationArea[]

  /**
   * @description 维度联动配置
   */
  dimensionLinkage?: DimensionLinkage

  /**
   * @description 语言配置
   */
  locale?: Locale
}
