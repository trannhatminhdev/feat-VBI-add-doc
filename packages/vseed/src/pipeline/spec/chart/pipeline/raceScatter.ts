import type { VChartSpecPipeline } from 'src/types'
import {
  initScatter,
  colorAdapter,
  color,
  linearColor,
  backgroundColor,
  progressive,
  playerYLinear,
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
  playerXLinear,
  playerYY,
} from '../pipes'

const raceScatter: VChartSpecPipeline = [
  initScatter,
  colorAdapter(color, linearColor),
  backgroundColor,
  playerYY,
  playerXLinear,
  playerYLinear,

  label,
  brush,
  tooltip,
  progressive,
  colorAdapter(discreteLegend, colorLegend),
  verticalCrosshairLine,
  colorPointStyleFill(pointStyle),
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationAreaBand,
]

export const raceScatterSpecPipeline = raceScatter
