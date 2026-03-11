import type { IRoseChartSpec } from '@visactor/vchart'
import { isArray } from '@visactor/vutils'
import type { VChartSpecPipe } from 'src/types'
import { createFormatterByDimension } from 'src/pipeline/utils'
import { MeasureId } from 'src/dataReshape'

export const radarAngleAxis: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as IRoseChartSpec
  const { advancedVSeed } = context
  const { dimensions = [], encoding, datasetReshapeInfo, pivotAllDatasetReshapeInfo } = advancedVSeed

  if (!result.axes) {
    result.axes = []
  }

  const onlyMeasureId = (encoding.angle || []).filter((v) => v !== MeasureId).length === 0
  const dimensionMap = new Map(dimensions.map((item) => [item.id, item]))
  const dimIds = (encoding.angle || []).filter((v) => v !== MeasureId)
  // 目前只考虑单个xEncoding的场景
  const dimFormatter = dimIds.length
    ? createFormatterByDimension(dimensionMap.get(dimIds[0]), advancedVSeed.locale)
    : null
  const allDatasetReshapeInfo = pivotAllDatasetReshapeInfo || datasetReshapeInfo

  const colorIdMap = allDatasetReshapeInfo.reduce<Record<string, { id: string; alias: string }>>((prev, cur) => {
    return { ...prev, ...cur.unfoldInfo.colorIdMap }
  }, {})

  result.axes.push({
    orient: 'angle',
    visible: true,
    zero: true,
    nice: true,
    label: {
      formatMethod: (text: string | string[]) => {
        if (isArray(text)) {
          return text
        }
        if (onlyMeasureId) {
          return colorIdMap[String(text)]?.alias ?? text
        }
        const rawText = String(text ?? '')
        if (!dimFormatter) {
          return rawText
        }
        return dimFormatter(rawText)
      },
    },
    grid: {
      visible: true,
    },
    domainLine: {
      visible: true,
    },
    tick: {
      visible: true,
    },
  })

  return result
}
