import type { VChartSpecPipe } from 'src/types'
import { tooltip as commonTooltip } from './tooltip'

export const tooltipSunburst: VChartSpecPipe = (spec, context) => {
  // Reuse common tooltip logic
  const result = commonTooltip(spec, context)

  if (result.tooltip) {
    if (!result.tooltip.mark) {
      result.tooltip.mark = {}
    }
    result.tooltip.mark.title = {
      value: (val: any) => {
        return val?.datum?.map((data: any) => data.name).join(' / ')
      },
    }
  }

  return result
}
