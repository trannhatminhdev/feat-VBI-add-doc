import {
  getLightColor,
  getLightLabel,
  getLightLegend,
  getLightBrushConfig,
  getLightPivotChartGridConfig,
} from '../common'
import { getLightTooltip } from '../common/tooltip'

export const getTreeMapTheme = () => {
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
    pivotGrid: getLightPivotChartGridConfig(),
  }
}

export const getSunburstTheme = () => {
  return getTreeMapTheme()
}

export const getCirclePackingTheme = () => {
  return getTreeMapTheme()
}
