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
  colorPieStyleFill,
  labelPie,
  playerPie,
  annotationArea,
  datasetXY,
  isPlayer,
  fontFamilyTheme,
} from '../pipes'

const racePie: VChartSpecPipeline = [
  fontFamilyTheme,
  initPie,
  colorAdapter(color, linearColor),
  backgroundColor,
  isPlayer(playerPie, datasetXY),
  progressive,
  brush,
  colorPieStyleFill(pieStyle),
  colorAdapter(discreteLegend, colorLegend),
  labelPie,
  tooltip({ titleEncoding: 'color' }),
  annotationPoint,
  annotationVerticalLine,
  annotationHorizontalLine,
  annotationArea,
]

export const racePieSpecPipeline = racePie
