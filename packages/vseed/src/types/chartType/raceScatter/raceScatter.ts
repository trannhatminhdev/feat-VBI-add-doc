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

export interface RaceScatter {
  chartType: 'raceScatter'
  dataset: Dataset
  dimensions?: RaceScatterDimension[]
  measures?: ScatterMeasure[]
  player?: Player
  sort?: Sort
  page?: Page

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

  color?: Color
  label?: Label
  legend?: Legend
  tooltip?: Tooltip
  brush?: Brush
  xAxis?: XLinearAxis
  yAxis?: YLinearAxis
  crosshairLine?: CrosshairLine
  theme?: Theme
  pointStyle?: PointStyle | PointStyle[]
  annotationPoint?: AnnotationPoint | AnnotationPoint[]
  annotationVerticalLine?: AnnotationVerticalLine | AnnotationVerticalLine[]
  annotationHorizontalLine?: AnnotationHorizontalLine | AnnotationHorizontalLine[]
  annotationArea?: AnnotationArea | AnnotationArea[]
  locale?: Locale
}
