import { getDarkPivotChartGridConfig, getDarkColor, getDarkBrushConfig, getDarkLabel, getDarkLegend } from '../common'
import { getDarkTooltip } from '../common/tooltip'

export const getPieTheme = () => {
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
    label: {
      ...baseConfig.label,
      showValuePercent: true,
      labelLayout: 'arc' as const,
      showDimension: true,
    },
    pivotGrid: getDarkPivotChartGridConfig(),
  }
}

export const getDonutTheme = () => {
  return getPieTheme()
}
