import {
  getDarkPivotChartGridConfig,
  getFunnelDarkLabel,
  getDarkColor,
  getDarkBrushConfig,
  getDarkLabel,
  getDarkLegend,
} from '../common'
import { getDarkTooltip } from '../common/tooltip'
import { getDarkFunnelTransformTheme } from '../common/funnelTransform'

export const getFunnelTheme = () => {
  const baseConfig = {
    backgroundColor: 'transparent',
    color: getDarkColor(),
    label: getDarkLabel(),
    legend: getDarkLegend(),
    tooltip: getDarkTooltip(),
    brush: getDarkBrushConfig(),
  }

  return {
    ...baseConfig,
    label: getFunnelDarkLabel(),
    transform: getDarkFunnelTransformTheme(),

    pivotGrid: getDarkPivotChartGridConfig(),
  }
}
