import { getDarkPivotChartGridConfig, getDarkColor, getDarkBrushConfig, getDarkLabel, getDarkLegend } from '../common'
import { getDarkTooltip } from '../common/tooltip'

export const getTreeMapTheme = () => {
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
    pivotGrid: getDarkPivotChartGridConfig(),
  }
}

export const getSunburstTheme = () => {
  return getTreeMapTheme()
}

export const getCirclePackingTheme = () => {
  return getTreeMapTheme()
}
