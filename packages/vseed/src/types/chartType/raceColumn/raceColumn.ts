import { type Locale } from '../../i18n'
import type {
  BarMaxWidth,
  RaceColumnDimension,
  DimensionLinkage,
  Sort,
  SortLegend,
  Player,
  AnnotationArea,
  AnnotationHorizontalLine,
  AnnotationPoint,
  AnnotationVerticalLine,
  BackgroundColor,
  Brush,
  BarStyle,
  Color,
  CrosshairRect,
  Dataset,
  Label,
  Legend,
  StackCornerRadius,
  Theme,
  Tooltip,
  XLinearAxis,
  YBandAxis,
  Page,
  ColumnMeasure,
} from '../../properties'

export interface RaceColumn {
  chartType: 'raceColumn'
  dataset: Dataset
  dimensions?: RaceColumnDimension[]
  measures?: ColumnMeasure[]
  player?: Player
  sort?: Sort
  page?: Page
  backgroundColor?: BackgroundColor
  color?: Color
  label?: Label
  legend?: Legend
  tooltip?: Tooltip
  brush?: Brush
  xAxis?: YBandAxis // Swapped for column
  yAxis?: XLinearAxis // Swapped for column
  crosshairRect?: CrosshairRect
  stackCornerRadius?: StackCornerRadius
  barMaxWidth?: BarMaxWidth
  sortLegend?: SortLegend
  theme?: Theme
  barStyle?: BarStyle | BarStyle[]
  annotationPoint?: AnnotationPoint | AnnotationPoint[]
  annotationVerticalLine?: AnnotationVerticalLine | AnnotationVerticalLine[]
  annotationHorizontalLine?: AnnotationHorizontalLine | AnnotationHorizontalLine[]
  annotationArea?: AnnotationArea | AnnotationArea[]
  dimensionLinkage?: DimensionLinkage
  locale?: Locale
}
