import {
  getLightColor,
  getLightLabel,
  getLightLegend,
  getLightBrushConfig,
  getLightPivotChartGridConfig,
} from '../common'
import { getLightTooltip } from '../common/tooltip'

export const getPieTheme = () => {
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
    label: {
      ...baseConfig.label,
      showValuePercent: true,
      labelLayout: 'arc' as const,
      showDimension: true,
    },

    pivotGrid: getLightPivotChartGridConfig(),
  }
}

export const getDonutTheme = () => {
  return getPieTheme()
}
