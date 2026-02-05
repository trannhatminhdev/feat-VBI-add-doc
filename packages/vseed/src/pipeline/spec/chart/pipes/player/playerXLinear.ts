import type { VChartSpecPipe } from 'src/types'
import { xLinear } from '../axes'
import type { IBarChartSpec, ICartesianLinearAxisSpec } from '@visactor/vchart'

export const playerXLinear: VChartSpecPipe = (spec, context) => {
  const result = xLinear(spec, context) as IBarChartSpec
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
