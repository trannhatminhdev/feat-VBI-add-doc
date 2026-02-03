import type { CustomThemeConfig, Player, YBandAxis } from 'src/types'
import {
  getDarkColor,
  getDarkCrosshairLine,
  getDarkCrosshairRect,
  getDarkBrushConfig,
  getDarkTableConfig,
  getDarkPivotChartGridConfig,
  getDarkLabel,
  getDarkLegend,
  getDarkColorLegend,
  getFunnelDarkLabel,
  getDarkPlayer,
} from '../common'
import { getDarkTooltip } from '../common/tooltip'
import { getDarkBandAxis, getDarkLinearAxis } from '../common/axes'
import { getDarkAnnotation } from '../common/annotaion'
import { getDarkFunnelTransformTheme } from '../common/funnelTransform'
import { getDarkHeatmapCellTheme } from '../common/heatmapCell'
import { getDarkRegressionLine } from '../common/regressionLine'
import { getDarkBoxPlotStyle, getDarkOutlierStyle } from '../common/boxPlot'

export const darkTheme = (): CustomThemeConfig => {
  const linearAxis = getDarkLinearAxis()
  const bandAxis = getDarkBandAxis()
  const barBandAxis: YBandAxis = {
    ...bandAxis,
    labelAutoHide: false,
    labelAutoHideGap: 1,
    labelAutoLimit: false,
    labelAutoLimitLength: undefined,
    labelAutoRotate: false,
    labelAutoRotateAngleRange: [0, -45, -90],
  }
  const crosshairLine = getDarkCrosshairLine()
  const crosshairRect = getDarkCrosshairRect()

  const baseConfig = {
    backgroundColor: 'transparent',
    color: getDarkColor(),
    label: getDarkLabel(),
    legend: getDarkLegend(),
    tooltip: getDarkTooltip(),
    brush: getDarkBrushConfig(),
  }
  const player = getDarkPlayer() as Player

  const tableConfig = getDarkTableConfig()

  return {
    config: {
      table: tableConfig,
      pivotTable: tableConfig,

      // cartesian
      line: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairLine: crosshairLine,
        player,

        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
      },
      column: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,

        regressionLine: getDarkRegressionLine(),
      },
      columnParallel: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      columnPercent: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      bar: {
        ...baseConfig,

        xAxis: linearAxis,
        yAxis: barBandAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      barParallel: {
        ...baseConfig,

        xAxis: linearAxis,
        yAxis: barBandAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      barPercent: {
        ...baseConfig,

        xAxis: linearAxis,
        yAxis: barBandAxis,
        crosshairRect: crosshairRect,
        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      area: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairLine: crosshairLine,
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      areaPercent: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairLine: crosshairLine,
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        player,
      },
      scatter: {
        ...baseConfig,
        crosshairLine,
        sizeRange: [8, 24],
        xAxis: {
          ...linearAxis,
          line: {
            ...linearAxis.line,
            visible: true,
          },
        },
        yAxis: {
          ...linearAxis,
          line: {
            ...linearAxis.line,
            visible: true,
          },
        },
        label: {
          ...baseConfig.label,
          showValue: false,
          showValuePercent: false,
        },
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        regressionLine: getDarkRegressionLine(),
        player,
      },
      dualAxis: {
        ...baseConfig,
        xAxis: bandAxis,
        primaryYAxis: linearAxis,
        secondaryYAxis: { ...linearAxis, grid: { visible: false } },
        crosshairRect,
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
      },
      // polar
      pie: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          labelLayout: 'arc',
          showDimension: true,
        },
        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      donut: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          labelLayout: 'arc',
          showDimension: true,
        },
        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      radar: {
        ...baseConfig,
        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      rose: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          showDimension: true,
        },
        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      roseParallel: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          showDimension: true,
        },

        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      // other
      funnel: {
        ...baseConfig,
        label: getFunnelDarkLabel(),
        transform: getDarkFunnelTransformTheme(),

        pivotGrid: getDarkPivotChartGridConfig(),
        player,
      },
      heatmap: {
        ...baseConfig,
        legend: getDarkColorLegend(),
        xAxis: bandAxis,
        yAxis: bandAxis,
        label: {
          ...baseConfig.label,
          labelColorSmartInvert: true,
        },
        player,

        cell: getDarkHeatmapCellTheme(),
        pivotGrid: getDarkPivotChartGridConfig(),
      },
      histogram: {
        ...baseConfig,

        xAxis: linearAxis,
        yAxis: linearAxis,
        crosshairRect: crosshairRect,
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),
        regressionLine: getDarkRegressionLine(),
      },
      boxPlot: {
        ...baseConfig,

        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect: crosshairRect,
        pivotGrid: getDarkPivotChartGridConfig(),
        annotation: getDarkAnnotation(),

        boxPlotStyle: getDarkBoxPlotStyle(),
        outlierStyle: getDarkOutlierStyle(),
      },
    },
  }
}
