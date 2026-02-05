import type { VChartSpecPipe } from 'src/types'
import { yLinear } from '../axes'
import type { IBarChartSpec, ICartesianLinearAxisSpec } from '@visactor/vchart'

export const playerYLinear: VChartSpecPipe = (spec, context) => {
  const result = yLinear(spec, context) as IBarChartSpec
  const linearAxis = result.axes?.find((axis) => axis?.type === 'linear') as ICartesianLinearAxisSpec

  if (linearAxis) {
    linearAxis.animation = true
    linearAxis.nice = false
    if (linearAxis.tick) {
      linearAxis.tick.tickStep = 10000
    }
  }
  return result
}
