import type { VChartSpecPipe } from 'src/types'
import type { ITreemapChartSpec } from '@visactor/vchart'

export const initTreeMap: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ITreemapChartSpec
  const { advancedVSeed } = context
  const { datasetReshapeInfo } = advancedVSeed
  const { foldInfo } = datasetReshapeInfo[0]

  result.type = 'treemap'
  result.categoryField = 'name'
  result.valueField = foldInfo.measureValue
  result.padding = 0
  result.animationEnter = {
    easing: 'cubicInOut',
  }
  result.animationExit = {
    easing: 'cubicInOut',
  }
  result.animationUpdate = {
    easing: 'cubicInOut',
  }

  return result
}
