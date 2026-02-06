import type { VChartSpecPipeline } from 'src/types'
import {
  initScatter,
  colorAdapter,
  color,
  linearColor,
  backgroundColor,
  progressive,
  label,
  brush,
  tooltip,
  discreteLegend,
  colorLegend,
  verticalCrosshairLine,
  colorPointStyleFill,
  pointStyle,
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationAreaBand,
  playerYY,
  xLinear,
  yLinear,
} from '../pipes'

const raceScatter: VChartSpecPipeline = [
  initScatter,
  colorAdapter(color, linearColor),
  backgroundColor,
  playerYY,
  progressive,
  xLinear,
  yLinear,

  label,
  brush,
  tooltip,
  colorAdapter(discreteLegend, colorLegend),
  verticalCrosshairLine,
  colorPointStyleFill(pointStyle),
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationAreaBand,
]

export const raceScatterSpecPipeline = raceScatter
