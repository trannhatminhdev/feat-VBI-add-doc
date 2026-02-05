import type { IPlayerSpec } from '@visactor/vchart'
import { groupBy } from 'remeda'
import { isPivotChart, isVTable } from 'src/pipeline/utils'
import type { Player, VChartSpecPipe } from 'src/types'

export const playerAdapter = (pipe: VChartSpecPipe): VChartSpecPipe => {
  return (spec, context) => {
    const { vseed, advancedVSeed } = context
    const { datasetReshapeInfo, chartType } = advancedVSeed
    const baseConfig = advancedVSeed.config[chartType] as { player: Player }
    if (!('player' in vseed) || !baseConfig || !baseConfig.player || isVTable(vseed) || isPivotChart(vseed)) {
      return pipe(spec, context)
    }
    const { player } = baseConfig

    const id = datasetReshapeInfo[0].id
    const nextSpec = pipe(spec, context)
    const {
      field,
      autoPlay = true,
      interval = 1000,
      loop = false,
      position,
      railColor,
      trackColor,
      sliderHandleColor,
      sliderHandleBorderColor,
      startButtonColor,
      pauseButtonColor,
      backwardButtonColor,
      forwardButtonColor,
    } = player

    const dataGroups = groupBy(advancedVSeed.dataset, (item) => item[field])

    const specs = Object.values(dataGroups).map((items) => ({
      data: {
        id: id,
        values: items,
      },
    }))

    return {
      ...nextSpec,
      stackCornerRadius: undefined,
      player: {
        visible: true,
        auto: autoPlay,
        interval: interval,
        loop: loop,
        alternate: false,
        position: 'middle',
        orient: position,
        type: 'discrete',
        specs,
        controller: {
          visible: true,
          start: { visible: true, order: 0, style: { fill: startButtonColor } },
          pause: { visible: true, order: 1, style: { fill: pauseButtonColor } },
          backward: { visible: true, order: 2, style: { fill: backwardButtonColor } },
          forward: { visible: true, order: 3, position: 'end', style: { fill: forwardButtonColor } },
        },
        slider: {
          visible: true,
          railStyle: {
            visible: true,
            fill: railColor,
            [position === 'top' || position === 'bottom' ? 'height' : 'width']: 2,
          },
          trackStyle: {
            visible: true,
            fill: trackColor,
            [position === 'top' || position === 'bottom' ? 'height' : 'width']: 2,
          },
          handlerStyle: {
            visible: true,
            lineWidth: 2,
            stroke: sliderHandleBorderColor,
            fill: sliderHandleColor,
            size: 9,
          },
        },
      } as IPlayerSpec,
    }
  }
}
