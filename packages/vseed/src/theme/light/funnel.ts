import {
  getLightColor,
  getLightLabel,
  getLightLegend,
  getLightBrushConfig,
  getLightPivotChartGridConfig,
  getFunnelLightLabel,
} from '../common'
import { getLightTooltip } from '../common/tooltip'
import { getLightFunnelTransformTheme } from '../common/funnelTransform'

export const getFunnelTheme = () => {
  const baseConfig = {
    backgroundColor: 'transparent',
    color: getLightColor(),
    label: getLightLabel(),
    legend: getLightLegend(),
    tooltip: getLightTooltip(),
    brush: getLightBrushConfig(),
  }

  return {
    ...baseConfig,
    label: getFunnelLightLabel(),
    transform: getLightFunnelTransformTheme(),

    pivotGrid: getLightPivotChartGridConfig(),
  }
}
