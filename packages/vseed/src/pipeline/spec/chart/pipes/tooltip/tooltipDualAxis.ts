import { createDimensionContent, createMarkContent } from './tooltip'
import type { VChartSpecPipe, Tooltip, Measures, DualAxisOptions } from 'src/types'
import { getTooltipStyle } from './tooltipStyle'
import { updateTooltipElement } from './tooltipElement'
import { createFormatterByDimension } from 'src/pipeline/utils'
import { Separator } from 'src/dataReshape'

export const tooltipOfDualAxisSeries = (options: DualAxisOptions): VChartSpecPipe => {
  return (spec, context) => {
    const result = { ...spec }
    const { advancedVSeed, vseed } = context
    const {
      measures = [],
      datasetReshapeInfo,
      chartType,
      dimensions = [],
      encoding,
      reshapeMeasures = [],
    } = advancedVSeed
    const baseConfig = advancedVSeed.config[chartType] as { tooltip: Tooltip }
    const { tooltip = { enable: true } } = baseConfig
    const { enable } = tooltip

    const unfoldInfo = datasetReshapeInfo[0].unfoldInfo

    result.tooltip = {
      visible: enable,
      mark: {
        title: {
          visible: false,
        },
        content: createMarkContent(
          encoding.tooltip || [],
          dimensions,
          vseed.measures as Measures,
          options.foldInfo,
          unfoldInfo,
          advancedVSeed.locale,
        ),
      },
      dimension: {
        title: {
          visible: true,
          value: (datum?: Record<string, unknown>) => {
            if (!datum) {
              return ''
            }
            const dimIds = encoding.x || []
            const formatted = dimIds.map((id) => {
              const dim = dimensions.find((item) => item.id === id)
              if (!dim) {
                return datum?.[id] as string
              }
              const formatter = createFormatterByDimension(dim, advancedVSeed.locale)
              return formatter(datum?.[id] as string | number)
            })
            return formatted.join(Separator)
          },
        },
        content: createDimensionContent(
          encoding.tooltip || [],
          encoding.color || [],
          measures,
          options.foldInfo,
          unfoldInfo,
          reshapeMeasures.length > 1,
        ),
      },
    }
    return result
  }
}

export const tooltipDualAxis: VChartSpecPipe = (spec, context) => {
  const result = { ...spec }
  const { advancedVSeed } = context
  const { chartType } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { tooltip: Tooltip }
  const { tooltip = { enable: true } } = baseConfig

  result.tooltip = {
    style: getTooltipStyle(tooltip),
    updateElement: updateTooltipElement,
  }
  return result
}
