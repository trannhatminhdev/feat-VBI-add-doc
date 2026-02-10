import {
  getDarkPivotChartGridConfig,
  getDarkColor,
  getDarkCrosshairRect,
  getDarkBrushConfig,
  getDarkLabel,
  getDarkLegend,
} from '../common'
import { getDarkTooltip } from '../common/tooltip'
import { getDarkBandAxis, getDarkLinearAxis } from '../common/axes'
import { getDarkAnnotation } from '../common/annotaion'
import { getDarkBoxPlotStyle, getDarkOutlierStyle } from '../common/boxPlot'

export const getBoxPlotTheme = () => {
  const linearAxis = getDarkLinearAxis()
  const bandAxis = getDarkBandAxis()
  const crosshairRect = getDarkCrosshairRect()

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

    xAxis: bandAxis,
    yAxis: linearAxis,
    crosshairRect: crosshairRect,
    pivotGrid: getDarkPivotChartGridConfig(),
    annotation: getDarkAnnotation(),

    boxPlotStyle: getDarkBoxPlotStyle(),
    outlierStyle: getDarkOutlierStyle(),
  }
}
