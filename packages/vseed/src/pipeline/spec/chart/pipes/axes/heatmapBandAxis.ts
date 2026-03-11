import type { ISpec } from '@visactor/vchart'
import type { VChartSpecPipe, XBandAxis, YBandAxis } from 'src/types'
import { bandAxisStyle } from './bandAxisStyle'
import { createFormatterByDimension } from 'src/pipeline/utils'

export const heatmapBandAxis: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ISpec
  const { advancedVSeed, vseed } = context
  const { chartType } = vseed
  const { dimensions = [], encoding } = advancedVSeed
  const xAxisConfig = (advancedVSeed.config?.[chartType as 'heatmap']?.xAxis ?? {}) as XBandAxis
  const yAxisConfig = (advancedVSeed.config?.[chartType as 'heatmap']?.yAxis ?? {}) as YBandAxis
  const xBandAxis = bandAxisStyle(xAxisConfig)
  const yBandAxis = bandAxisStyle(yAxisConfig)

  xBandAxis.orient = 'bottom'
  xBandAxis.bandPadding = 0
  yBandAxis.orient = 'left'
  yBandAxis.bandPadding = 0

  const formatBandLabel = (axis: 'x' | 'y') => {
    const dimIds = (axis === 'x' ? encoding.x : encoding.y) || []
    const dimFormatter = dimIds.length
      ? createFormatterByDimension(
          dimensions.find((item) => item.id === dimIds[0]),
          advancedVSeed.locale,
        )
      : null
    return (text: string | string[]) => {
      if (Array.isArray(text)) {
        return text
      }
      const rawText = String(text ?? '')
      if (!dimFormatter) {
        return rawText
      }
      return dimFormatter(rawText)
    }
  }

  if (xBandAxis.label) {
    xBandAxis.label.formatMethod = formatBandLabel('x')
  }
  if (yBandAxis.label) {
    yBandAxis.label.formatMethod = formatBandLabel('y')
  }

  result.axes = [xBandAxis, yBandAxis]

  return result
}
