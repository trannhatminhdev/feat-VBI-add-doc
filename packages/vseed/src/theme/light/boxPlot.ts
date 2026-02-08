import {
  getLightColor,
  getLightLabel,
  getLightLegend,
  getLightBrushConfig,
  getLightPivotChartGridConfig,
  getLightCrosshairRect,
} from '../common'
import { getLightTooltip } from '../common/tooltip'
import { getLightAnnotation } from '../common/annotaion'
import { getLightLinearAxis } from '../common/axes'
import { getLightBoxPlotStyle, getLightOutlierStyle } from '../common/boxPlot'

export const getBoxPlotTheme = () => {
  const linearAxis = getLightLinearAxis()
  const crosshairRect = getLightCrosshairRect()

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
    xAxis: linearAxis,
    yAxis: linearAxis,
    crosshairRect,
    pivotGrid: getLightPivotChartGridConfig(),
    annotation: getLightAnnotation(),

    boxPlotStyle: getLightBoxPlotStyle(),
    outlierStyle: getLightOutlierStyle(),
  }
}
