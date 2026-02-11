import type { VChartSpecPipeline } from 'src/types'
import {
  initPie,
  backgroundColor,
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
  labelPie,
  annotationArea,
} from '../pipes'

const racePie: VChartSpecPipeline = [
  initPie,
  colorAdapter(color, linearColor),
  backgroundColor,
  datasetXY,
  progressive,
  brush,
  colorPieStyleFill(pieStyle),
  colorAdapter(discreteLegend, colorLegend),
  labelPie,
  tooltip,
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationArea,
]

export const racePieSpecPipeline = racePie
