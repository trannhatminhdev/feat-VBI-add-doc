import { type Locale } from '../../i18n'
import type {
  ScatterDimension,
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
} from '../../properties'

export interface RaceScatter {
  chartType: 'raceScatter'
  dataset: Dataset
  dimensions?: ScatterDimension[]
  measures?: ScatterMeasure[]
  player?: Player
  sort?: Sort
  page?: Page
  backgroundColor?: BackgroundColor
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
