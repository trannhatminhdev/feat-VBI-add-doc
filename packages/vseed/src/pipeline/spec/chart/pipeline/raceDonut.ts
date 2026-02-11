import type { VChartSpecPipeline } from 'src/types'
import {
  initDonut,
  backgroundColor,
  labelPie,
  tooltip,
  discreteLegend,
  color,
  pieStyle,
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  progressive,
  colorAdapter,
  linearColor,
  colorLegend,
  brush,
  datasetXY,
  colorPieStyleFill,
  annotationArea,
} from '../pipes'

const raceDonut: VChartSpecPipeline = [
  initDonut,
  colorAdapter(color, linearColor),
  backgroundColor,
  datasetXY,
  progressive,
  brush,
  labelPie,
  colorPieStyleFill(pieStyle),
  colorAdapter(discreteLegend, colorLegend),
  tooltip,
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationArea,
]

export const raceDonutSpecPipeline = raceDonut
