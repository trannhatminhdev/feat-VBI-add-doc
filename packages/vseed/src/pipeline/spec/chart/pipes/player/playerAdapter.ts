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
          start: { visible: true, style: { fill: startButtonColor } },
          pause: { visible: true, style: { fill: pauseButtonColor } },
          backward: { visible: true, style: { fill: backwardButtonColor } },
          forward: { visible: true, style: { fill: forwardButtonColor } },
        },
        slider: {
          visible: true,
          railStyle: { visible: true, fill: railColor },
          trackStyle: { visible: true, fill: trackColor },
          handlerStyle: { visible: true, fill: sliderHandleColor, lineWidth: 1 },
        },
      } as IPlayerSpec,
    }
  }
}
