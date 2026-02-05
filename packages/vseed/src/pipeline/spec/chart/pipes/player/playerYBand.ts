import type { VChartSpecPipe } from 'src/types'
import { yBand } from '../axes'
import type { IBarChartSpec } from '@visactor/vchart'
import type { ICartesianBandAxisSpec } from '@visactor/vchart/esm/component/axis'

export const playerYBand: VChartSpecPipe = (spec, context) => {
  const result = yBand(spec, context) as IBarChartSpec
  const bandAxis = result.axes?.find((axis) => axis?.type === 'band') as ICartesianBandAxisSpec

  if (bandAxis) {
    bandAxis.animation = true
    bandAxis.width = '15%'
  }
  return result
}
