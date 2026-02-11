import type { IPlayerSpec, ISpec } from '@visactor/vchart'
import type { Player, VChartSpecPipe } from 'src/types'
import { datasetXY } from '../dataset'

export const playerLine: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { datasetReshapeInfo, chartType } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { player: Player }
  const result = datasetXY(spec, context)

  if (!baseConfig || !baseConfig.player) {
    return result
  }
  const { player } = baseConfig

  const id = datasetReshapeInfo[0].id
  const { unfoldInfo } = datasetReshapeInfo[0]
  const { encodingX } = unfoldInfo

  const {
    maxCount = false,
    autoPlay = true,
    interval,
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

  // 数据分组的依据有比较大的改变
  // X轴由2个逐渐增加
  // 从而保证每次更新时, X轴会自然的移动

  // 1. 获取所有唯一的 X 轴值并排序
  const uniqueXValues = Array.from(new Set(advancedVSeed.dataset.map((d) => d[encodingX]))).sort((a, b) => {
    // 假设X轴是数字或可以比较的
    return a > b ? 1 : -1
  })

  // 2. 生成specs
  // X轴由2个逐渐增加 -> 窗口大小 maxCount (默认20?)
  // 每次移动1个 -> step = 1
  const step = 1
  const specs: any[] = []

  // 我们清空默认数据，由 player 控制
  // 但是我们需要在初始状态下提供结构
  result.data = [
    {
      id: id,
      values: [], // 初始为空，由 player 填充第一帧
    },
  ]

  // 如果 maxCount 为 false，则不进行限制，显示所有数据
  // 或者如果X轴点数小于 maxCount，直接作为一个frame
  if (maxCount === false) {
    // 即使没有maxCount限制，我们也要模拟数据逐个增加的过程
    // 否则就没有动画效果了，直接显示最终结果
    // 所以这里我们需要生成一系列 specs，从 2 个点一直增加到所有点
    for (let currentSize = 2; currentSize <= uniqueXValues.length; currentSize += step) {
      // 窗口从 0 开始，长度为 currentSize
      const currentXValues = uniqueXValues.slice(0, currentSize)
      const frameData = advancedVSeed.dataset.filter((d) => currentXValues.includes(d[encodingX]))

      specs.push({
        data: {
          id: id,
          values: frameData,
        },
      })
    }
  } else if (uniqueXValues.length <= (maxCount as number)) {
    // 如果数据总量本身就小于等于 maxCount，那也是逐步增加到全部显示
    const limitCount = uniqueXValues.length
    for (let currentSize = 2; currentSize <= limitCount; currentSize += step) {
      // 窗口从 0 开始，长度为 currentSize
      const currentXValues = uniqueXValues.slice(0, currentSize)
      const frameData = advancedVSeed.dataset.filter((d) => currentXValues.includes(d[encodingX]))

      specs.push({
        data: {
          id: id,
          values: frameData,
        },
      })
    }
  } else {
    const limitCount = maxCount as number
    // 阶段1: 增长阶段 (Growing Phase)
    // 从 2 个点开始，逐渐增加到 maxCount 个点
    // 每次增加 step 个点 (或者尽量接近 step，这里简化为 i 代表当前窗口大小)
    // 假设初始窗口大小为 2
    for (let currentSize = 2; currentSize < limitCount; currentSize += step) {
      // 窗口从 0 开始，长度为 currentSize
      const currentXValues = uniqueXValues.slice(0, currentSize)
      const frameData = advancedVSeed.dataset.filter((d) => currentXValues.includes(d[encodingX]))

      specs.push({
        data: {
          id: id,
          values: frameData,
        },
      })
    }

    // 阶段2: 滑动阶段 (Sliding Phase)
    // 窗口大小固定为 maxCount，窗口起始位置向右移动
    for (let i = 0; i <= uniqueXValues.length - limitCount; i += step) {
      // 获取当前窗口的 X 值范围
      const currentXValues = uniqueXValues.slice(i, i + limitCount)
      // 过滤出这些 X 值对应的数据
      const frameData = advancedVSeed.dataset.filter((d) => currentXValues.includes(d[encodingX]))

      specs.push({
        data: {
          id: id,
          values: frameData,
        },
      })
    }
  }

  const duration = interval

  // 样式部分复用 playerXY
  return {
    ...result,
    stackCornerRadius: undefined,
    animationUpdate: {
      duration,
    },
    point: {
      visible: false,
    },
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
