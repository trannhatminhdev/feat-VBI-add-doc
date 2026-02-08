import type { VChartSpecPipe } from 'src/types'
import type { ICirclePackingChartSpec } from '@visactor/vchart'

export const initCirclePacking: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ICirclePackingChartSpec
  const { advancedVSeed } = context
  const { datasetReshapeInfo } = advancedVSeed
  const { foldInfo } = datasetReshapeInfo[0]

  result.type = 'circlePacking'
  result.categoryField = 'name'
  result.valueField = foldInfo.measureValue

  // Style configuration
  result.drill = true
  result.circlePacking = {
    style: {
      fillOpacity: (d: any) => (d.isLeaf ? 0.75 : 0.25),
    },
  }
  result.layoutPadding = [0, 10, 10]

  // Animation configuration
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
