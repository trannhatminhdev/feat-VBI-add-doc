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
  colorPieStyleFill,
  playerPie,
  annotationArea,
  datasetXY,
  isPlayer,
} from '../pipes'

const raceDonut: VChartSpecPipeline = [
  initDonut,
  colorAdapter(color, linearColor),
  backgroundColor,
  isPlayer(playerPie, datasetXY),
  progressive,
  brush,
  labelPie,
  colorPieStyleFill(pieStyle),
  colorAdapter(discreteLegend, colorLegend),
  tooltip({ titleEncoding: 'color' }),
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationArea,
]

export const raceDonutSpecPipeline = raceDonut
