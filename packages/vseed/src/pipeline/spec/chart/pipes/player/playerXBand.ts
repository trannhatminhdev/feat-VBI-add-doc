import type { VChartSpecPipe } from 'src/types'
import { xBand } from '../axes'
import type { IBarChartSpec } from '@visactor/vchart'
import type { ICartesianBandAxisSpec } from '@visactor/vchart/esm/component/axis'

export const playerXBand: VChartSpecPipe = (spec, context) => {
  const result = xBand(spec, context) as IBarChartSpec
  const bandAxis = result.axes?.find((axis) => axis?.type === 'band') as ICartesianBandAxisSpec

  if (bandAxis) {
    bandAxis.animation = true
  }
  return result
}
