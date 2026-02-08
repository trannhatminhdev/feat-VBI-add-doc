import type { VChartSpecPipe } from 'src/types'
import type { ISunburstChartSpec } from '@visactor/vchart'

export const initSunburst: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as ISunburstChartSpec
  const { advancedVSeed } = context
  const { datasetReshapeInfo, encoding } = advancedVSeed
  const { foldInfo } = datasetReshapeInfo[0]

  result.type = 'sunburst'
  result.categoryField = 'name'
  result.valueField = foldInfo.measureValue
  result.outerRadius = 1
  result.innerRadius = 0
  result.gap = 0
  result.offsetX = 0
  result.offsetY = 0
  result.drill = true
  result.padding = 0
  result.labelAutoVisible = {
    enable: true,
    circumference: 5,
  }
  result.sunburst = {
    visible: true,
    style: {
      fillOpacity: (datum: any) => {
        if (encoding.hierarchy?.length === 1) {
          return 1
        }
        return datum.isLeaf ? 0.4 : 0.8
      },
    },
  }

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
