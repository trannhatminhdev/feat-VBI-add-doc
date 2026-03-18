import type { IBarChartSpec } from '@visactor/vchart'
import { FoldMeasureId } from 'src/dataReshape/constant'
import type { Datum, VChartSpecPipe, StackCornerRadius } from 'src/types'

const reverseStackCornerRadius = (cornerRadius: StackCornerRadius): StackCornerRadius => {
  if (!Array.isArray(cornerRadius)) {
    return cornerRadius
  }

  const [topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0] = cornerRadius

  return [bottomRight, bottomLeft, topLeft, topRight]
}

const mergeStackCornerRadius = (cornerRadius: StackCornerRadius): StackCornerRadius => {
  if (!Array.isArray(cornerRadius)) {
    return cornerRadius
  }

  const [topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0] = cornerRadius

  return [
    Math.max(topLeft, bottomRight),
    Math.max(topRight, bottomLeft),
    Math.max(bottomRight, topLeft),
    Math.max(bottomLeft, topRight),
  ]
}

const getStackRangeCornerRadius = (
  cornerRadius: StackCornerRadius,
  datum: Datum,
): StackCornerRadius | 0 | undefined => {
  const stackStart = datum?.['__VCHART_STACK_START']
  const stackEnd = datum?.['__VCHART_STACK_END']

  if (typeof stackStart !== 'number' || typeof stackEnd !== 'number') {
    return undefined
  }

  const hasPositivePart = stackStart > 0 || stackEnd > 0
  const hasNegativePart = stackStart < 0 || stackEnd < 0

  if (hasPositivePart && hasNegativePart) {
    // Mixed positive/negative stack range: merge normal/reverse corners for whole-bar style.
    return mergeStackCornerRadius(cornerRadius)
  }

  if (hasPositivePart) {
    return cornerRadius
  }

  if (hasNegativePart) {
    return reverseStackCornerRadius(cornerRadius)
  }

  return 0
}

export const stackCornerRadius: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed, vseed } = context
  const { chartType } = vseed
  const stackCornerRadius = advancedVSeed.config?.[chartType as 'column']?.stackCornerRadius as StackCornerRadius

  if (chartType === 'dualAxis' && (spec as any).type !== 'bar') {
    return spec
  }

  return {
    ...spec,
    stackCornerRadius: (_: unknown, datum: Datum) => {
      const stackRangeCornerRadius = getStackRangeCornerRadius(stackCornerRadius, datum)

      if (stackRangeCornerRadius !== undefined) {
        return stackRangeCornerRadius
      }

      const value = datum?.[datum?.[FoldMeasureId]]

      if (value > 0) {
        return stackCornerRadius
      }

      if (value < 0) {
        return reverseStackCornerRadius(stackCornerRadius)
      }

      return 0
    },
  } as IBarChartSpec
}
