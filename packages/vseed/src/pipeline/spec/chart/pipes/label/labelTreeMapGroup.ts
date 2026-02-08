import type { ITreemapChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'

export const labelTreeMapGroup: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ITreemapChartSpec
  const { advancedVSeed } = context
  const { chartType } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { label: Label }
  const { label } = baseConfig

  if (!label.enable) {
    return result
  }

  result.nonLeaf = {
    visible: true,
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
        return [data.name]
      },
      fontSize: 12,
      fill: '#000',
    },
  }

  return result
}
