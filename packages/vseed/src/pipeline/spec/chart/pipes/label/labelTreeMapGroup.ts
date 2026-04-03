import type { ITreemapChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'
import { createFormatterByDimension } from 'src/pipeline/utils'

export const labelTreeMapGroup: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ITreemapChartSpec
  const { advancedVSeed } = context
  const { chartType, dimensions = [], encoding } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { label: Label }
  const { label } = baseConfig

  if (!label.enable) {
    return result
  }

  result.nonLeaf = {
    visible: true,
  }

  const dimIds = encoding.hierarchy || []
  const dimFormatters = dimIds.map((id) => {
    const dim = dimensions.find((item) => item.id === id)
    return createFormatterByDimension(dim, advancedVSeed.locale)
  })
  const formatHierarchyName = (name: string, depth: number) => {
    if (!dimFormatters?.[depth]) {
      return name
    }
    return dimFormatters[depth](name)
  }

  result.nonLeafLabel = {
    visible: true,
    position: 'top',
    padding: 30,
    style: {
      x: (data: any) => {
        return (data.labelRect?.x0 || 0) + 4
      },
      textAlign: 'left',
      text: (data: any) => {
        return formatHierarchyName(String(data.name ?? ''), data.depth)
      },
      fontSize: label?.labelFontSize ?? 12,
      fill: '#000',
    },
  }

  return result
}
