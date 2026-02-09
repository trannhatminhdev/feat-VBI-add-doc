import type { VChartSpecPipe } from 'src/types'

export const drill: VChartSpecPipe = (spec) => {
  return {
    ...spec,
    drill: true,
  }
}
