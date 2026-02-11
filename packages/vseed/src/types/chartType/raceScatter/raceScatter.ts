import { type Locale } from '../../i18n'
import type {
  ScatterMeasure,
  Player,
  Sort,
  AnnotationArea,
  AnnotationHorizontalLine,
  AnnotationPoint,
  AnnotationVerticalLine,
  BackgroundColor,
  Brush,
  Color,
  CrosshairLine,
  Dataset,
  Label,
  Legend,
  Page,
  PointStyle,
  Theme,
  Tooltip,
  XLinearAxis,
  YLinearAxis,
  RaceScatterDimension,
} from '../../properties'

/**
 * @description 动态散点图 (Race Scatter Chart)
 * 适用于展示数据随时间变化的分布情况，通过数据点的位置表示两个指标的数值
 * 适用场景：
 * - 分析数据在二维空间中的分布特征并展示其随时间的动态变化
 * - 展示多个变量之间的相关性随时间的演变
 * - 观察数据点在二维空间中的运动轨迹
 * @note
 * 动态散点图：
 * - X轴和Y轴均为数值轴（连续数据），支持多个指标映射
 * - 支持通过播放器控制时间维度，动态展示数据变化
 * - 通过数据点的位置变化直观展示数据的动态变化
 */
export interface RaceScatter {
  /**
   * @description 动态散点图，适用于展示数据随时间变化的分布情况
   * @type {'raceScatter'}
   */
  chartType: 'raceScatter'

  /**
   * @description 数据源，符合TidyData规范的数据集
   */
  dataset: Dataset

  /**
   * @description 维度，用于区分不同的数据系列和进行图例展示
   */
  dimensions?: RaceScatterDimension[]

  /**
   * @description 指标，至少需要2个指标分别映射至X轴和Y轴
   */
  measures?: ScatterMeasure[]

  /**
   * @description 播放器配置，用于指定时间维度，是动态散点图的核心配置
   * 通过播放器控制时间维度的播放进度，实现数据的动态更新
   */
  player?: Player

  /**
   * @description 排序配置，用于控制维度值的排序方式
   */
  sort?: Sort

  /**
   * @description 分页配置，用于处理数据量较大的场景
   */
  page?: Page

  /**
   * @description 背景颜色配置
   */
  backgroundColor?: BackgroundColor

  /**
   * @description 散点图指标的大小, 用于定义散点图中数据点的大小 或 大小范围
   * - 若大小范围是一个数字, 例如10, 表示数据点的大小范围固定为10
   * - 若大小范围是一个长度为2的数组, 例如[10, 40], 表示数据点的大小范围在10到40之间
   * - 与sizeRange互斥, 优先级低于 size
   */
  size?: number | number[]

  /**
   * @description 散点图指标的大小范围, 用于定义散点图中数据点的大小范围,
   * - 若大小范围是一个长度为2的数组, 例如[10, 40], 表示数据点的大小范围在10到40之间
   * - 若大小范围是一个数字, 例如10, 表示数据点的大小范围固定为10
   * - 与sizeRange互斥, 优先级高于 size
   */
  sizeRange?: number | number[]

  /**
   * @description 颜色配置，用于区分不同的维度或指标
   */
  color?: Color

  /**
   * @description 标签配置，用于在数据点上显示数据标签
   */
  label?: Label

  /**
   * @description 图例配置
   */
  legend?: Legend

  /**
   * @description 提示信息配置，用于鼠标悬停时展示详细信息
   */
  tooltip?: Tooltip

  /**
   * @description 框选配置，用于支持框选交互
   */
  brush?: Brush

  /**
   * @description X轴配置，为数值轴，展示第一个指标值
   */
  xAxis?: XLinearAxis

  /**
   * @description Y轴配置，为数值轴，展示第二个指标值
   */
  yAxis?: YLinearAxis

  /**
   * @description 十字线配置，用于展示数据的精确位置
   */
  crosshairLine?: CrosshairLine

  /**
   * @description 主题配置
   */
  theme?: Theme

  /**
   * @description 数据点样式配置，可以为单个样式或数组形式，支持全局样式或条件样式配置
   */
  pointStyle?: PointStyle | PointStyle[]

  /**
   * @description 标注点配置，用于在特定数据点上添加标记
   */
  annotationPoint?: AnnotationPoint | AnnotationPoint[]

  /**
   * @description 数值标注线，竖向标注线，标记特定的X轴数值
   */
  annotationVerticalLine?: AnnotationVerticalLine | AnnotationVerticalLine[]

  /**
   * @description 数值标注线，横向标注线，标记特定的Y轴数值
   */
  annotationHorizontalLine?: AnnotationHorizontalLine | AnnotationHorizontalLine[]

  /**
   * @description 标注区域配置，用于突出显示特定的数据范围
   */
  annotationArea?: AnnotationArea | AnnotationArea[]

  /**
   * @description 语言配置
   */
  locale?: Locale
}
