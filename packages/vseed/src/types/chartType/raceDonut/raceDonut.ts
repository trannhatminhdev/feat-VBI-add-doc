import { type Locale } from '../../i18n'
import type {
  BackgroundColor,
  Color,
  Dataset,
  Legend,
  DonutMeasure,
  PieLabel,
  Theme,
  Tooltip,
  Page,
  Player,
  RaceDonutDimension,
} from '../../properties'
import type { Brush } from '../../properties'

/**
 * @description 动态环形图 (Race Donut Chart)
 * 适用于展示数据随时间变化的占比关系，中心留有空白区域可展示汇总信息
 * 适用场景：
 * - 需要同时展示整体数据和各部分占比随时间的变化
 * - 强调数据的整体与部分关系
 * - 中心区域需要展示关键指标或标题
 * @note
 * 动态环形图：
 * - 角度映射指标值，颜色映射维度值
 * - 支持通过播放器控制时间维度，动态展示占比变化
 * - 相比饼图，中心区域留白，视觉上更轻量
 */
export interface RaceDonut {
  /**
   * @description 动态环形图，适用于展示数据随时间变化的占比关系
   * @type {'raceDonut'}
   */
  chartType: 'raceDonut'

  /**
   * @description 数据源
   */
  dataset: Dataset

  /**
   * @description 维度
   */
  dimensions?: RaceDonutDimension[]

  /**
   * @description 指标
   */
  measures?: DonutMeasure[]

  /**
   * @description 分页配置
   */
  page?: Page

  /**
   * @description 播放器配置, 用于指定时间维度, 动态环形图的核心配置
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
