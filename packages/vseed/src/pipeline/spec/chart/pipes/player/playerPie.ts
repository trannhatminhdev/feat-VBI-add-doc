import type { IPlayerSpec, ISpec } from '@visactor/vchart'
import { groupBy } from 'remeda'
import type { Player, VChartSpecPipe } from 'src/types'
import { datasetXY } from '../dataset'

export const playerPie: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { dimensions = [], datasetReshapeInfo, chartType, encoding } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { fontFamily?: string; player: Player }
  const result = datasetXY(spec, context)

  if (!baseConfig || !baseConfig.player) {
    return result
  }
  const { player } = baseConfig
  const fontFamily = player.fontFamily || baseConfig.fontFamily
  const textSize = player.fontSize ?? 36

  const id = datasetReshapeInfo[0].id
  const { unfoldInfo } = datasetReshapeInfo[0]
  const { encodingPlayer } = unfoldInfo
  const {
    maxCount,
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

  const dataGroups = groupBy(advancedVSeed.dataset, (item) => item[encodingPlayer])
  if (result.data && 'values' in result.data) {
    result.data.values = []
  }

  const specs = Object.keys(dataGroups)
    .sort()
    .map((key) => {
      const items = dataGroups[key]
      const sortedItems = items
      return {
        data: {
          id: id,
          values: maxCount === false ? sortedItems : sortedItems.slice(0, maxCount as number),
        },
      }
    })

  const duration = interval
  const exchangeDuration = interval * 0.6

  const dataKey = dimensions.filter((d) => !encoding.player?.includes(d.id)).map((d) => d.id)

  const padding = 12
  return {
    ...result,
    dataKey,
    stackCornerRadius: undefined,
    animationUpdate: {
      pie: [
        {
          type: 'update',
          options: { excludeChannels: ['angle', 'startAngle', 'endAngle'] },
          easing: 'linear',
          duration,
        },
        {
          channel: ['angle', 'startAngle', 'endAngle'],
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
    },
    animationEnter: {
      pie: [
        {
          type: 'update',
          duration: exchangeDuration,
          easing: 'circInOut',
        },
      ],
    },
    animationExit: {
      pie: [
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
          fontSize: textSize,
          textAlign: 'right',
          fontFamily,
          text: (datum: any) => datum[encodingPlayer],
          x: (_datum: any, ctx: any) => {
            return ctx.vchart.getChart().getCanvasRect()?.width - padding
          },
          y: (_datum: any, _ctx: any) => {
            return textSize + padding
          },
          fill: 'rgb(100, 100, 100)',
          fillOpacity: 0.25,
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
