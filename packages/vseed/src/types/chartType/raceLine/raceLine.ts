import type { Locale } from '../../i18n'
import type {
  AnnotationArea,
  AnnotationHorizontalLine,
  AnnotationPoint,
  AnnotationVerticalLine,
  BackgroundColor,
  Brush,
  Color,
  Dataset,
  Label,
  Legend,
  Page,
  LineStyle,
  PointStyle,
  Theme,
  Tooltip,
  CrosshairLine,
  XBandAxis,
  YLinearAxis,
  Sort,
  SortLegend,
  DimensionLinkage,
  Player,
  LineDimension,
  LineMeasure,
} from '../../properties'

/**
 * @description 动态折线图 (Race Line Chart)
 * 适用于展示数据随时间变化的趋势，通过线段连接数据点形成趋势线
 * 适用场景:
 * - 展示多个数据系列随时间的变化趋势
 * - 比较不同类别的增长或下降规律
 * - 观察数据在时间维度上的波动情况
 * @note
 * 动态折线图：
 * - X轴通常为时间轴或类目轴，展示维度值
 * - Y轴为数值轴，展示指标值
 * - 支持通过播放器控制时间维度，动态展示折线的延伸过程
 */
export interface RaceLine {
  /**
   * @description 动态折线图，适用于展示数据随时间变化的趋势
   * @type {'raceLine'}
   */
  chartType: 'raceLine'

  /**
   * @description 数据源
   */
  dataset: Dataset

  /**
   * @description 维度
   */
  dimensions?: LineDimension[]

  /**
   * @description 指标
   */
  measures?: LineMeasure[]

  /**
   * @description 分页配置
   */
  page?: Page

  /**
   * @description 播放器配置, 用于指定时间维度, 动态折线图的核心配置
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
   * @description x轴配置，为类目轴，展示维度值
   */
  xAxis?: XBandAxis

  /**
   * @description y轴配置，为数值轴，展示指标值
   */
  yAxis?: YLinearAxis

  /**
   * @description 垂直提示线配置
   */
  crosshairLine?: CrosshairLine

  /**
   * @description X轴排序配置
   */
  sort?: Sort
  /**
   * @description 图例排序配置
   */
  sortLegend?: SortLegend

  /**
   * @description 主题配置
   */
  theme?: Theme

  /**
   * @description 点图元样式配置
   */
  pointStyle?: PointStyle | PointStyle[]

  /**
   * @description 线图元样式配置
   */
  lineStyle?: LineStyle | LineStyle[]

  /**
   * @description 标注点配置
   */
  annotationPoint?: AnnotationPoint | AnnotationPoint[]

  /**
   * @description 维度值标注线配置
   */
  annotationVerticalLine?: AnnotationVerticalLine | AnnotationVerticalLine[]

  /**
   * @description 数值标注线配置
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
