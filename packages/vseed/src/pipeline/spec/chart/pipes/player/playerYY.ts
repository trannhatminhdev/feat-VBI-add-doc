import type { IPlayerSpec, ISpec } from '@visactor/vchart'
import { groupBy } from 'remeda'
import { isPivotChart, isVTable } from 'src/pipeline/utils'
import type { Player, VChartSpecPipe } from 'src/types'
import { datasetScatter } from '../dataset'

export const playerYY: VChartSpecPipe = (spec, context) => {
  const { vseed, advancedVSeed } = context
  const { datasetReshapeInfo, chartType, encoding } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { player: Player }
  const result = datasetScatter(spec, context)

  if (!('player' in vseed) || !baseConfig || !baseConfig.player || isVTable(vseed) || isPivotChart(vseed)) {
    return result
  }
  const { player } = baseConfig

  const id = datasetReshapeInfo[0].id
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
  if (result.data && 'values' in result.data) {
    result.data.values = []
  }
  const specs = Object.values(dataGroups).map((items) => ({
    data: {
      id: id,
      values: items,
    },
  }))

  const dataKey = encoding.color
  const duration = interval
  const exchangeDuration = interval * 0.6
  return {
    ...result,
    dataKey,
    stackCornerRadius: undefined,
    animationUpdate: {
      bar: [
        {
          type: 'update',
          options: { excludeChannels: ['x'] },
          easing: 'linear',
          duration,
        },
        {
          channel: ['x'],
          easing: 'circInOut',
          duration: exchangeDuration,
        },
      ],
      point: [
        {
          type: 'update',
          easing: 'linear',
          duration,
        },
      ],
      line: [
        {
          type: 'update',
          easing: 'linear',
          duration,
        },
      ],
      axis: {
        duration: exchangeDuration,
        easing: 'circInOut',
      },
    },
    animationEnter: {
      bar: [
        {
          type: 'moveIn',
          duration: exchangeDuration,
          easing: 'circInOut',
          options: {
            direction: 'x',
            orient: 'negative',
          },
        },
      ],
    },
    animationExit: {
      bar: [
        {
          type: 'fadeOut',
          duration: exchangeDuration,
        },
      ],
    },
    customMark: [
      {
        type: 'text',
        dataId: 'year',
        style: {
          textBaseline: 'bottom',
          fontSize: 24,
          textAlign: 'right',
          fontFamily: 'PingFang SC',
          fontWeight: 600,
          text: (datum: any) => datum.year,
          x: (datum: any, ctx: any) => {
            return ctx.vchart.getChart().getCanvasRect()?.width - 50
          },
          y: (datum: any, ctx: any) => {
            return ctx.vchart.getChart().getCanvasRect()?.height - 50
          },
          fill: 'grey',
          fillOpacity: 0.5,
        },
      },
    ],
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
  } as unknown as ISpec
}
