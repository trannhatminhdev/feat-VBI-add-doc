import type { Locale } from '../../i18n'

import type {
  BackgroundColor,
  Color,
  Dataset,
  Legend,
  PieMeasure,
  PieLabel,
  Theme,
  Tooltip,
  Page,
  Player,
  RacePieDimension,
} from '../../properties'
import type { Brush } from '../../properties'

/**
 * @description 动态饼图 (Race Pie Chart)
 * 适用于展示数据随时间变化的占比关系，通过扇形面积大小表示各类别占比
 * 适用场景：
 * - 展示分类数据的占比分布随时间的变化
 * - 强调数据的整体与部分关系在时间维度上的演变
 * - 观察不同类别在总量中的占比波动
 * @note
 * 动态饼图：
 * - 角度映射指标值，颜色映射维度值
 * - 支持通过播放器控制时间维度，动态展示占比变化
 * - 扇形面积随数据变化动态调整
 */
export interface RacePie {
  /**
   * @description 动态饼图，适用于展示数据随时间变化的占比关系
   * @type {'racePie'}
   */
  chartType: 'racePie'
  /**
   * @description 数据源
   */
  dataset: Dataset

  /**
   * @description 维度
   */
  dimensions?: RacePieDimension[]

  /**
   * @description 指标
   */
  measures?: PieMeasure[]

  /**
   * @description 分页配置
   */
  page?: Page

  /**
   * @description 播放器配置, 用于指定时间维度, 动态饼图的核心配置
   */
  player?: Player

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
  label?: PieLabel

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
   * @description 主题配置
   */
  theme?: Theme

  /**
   * @description 语言配置
   */
  locale?: Locale
}
