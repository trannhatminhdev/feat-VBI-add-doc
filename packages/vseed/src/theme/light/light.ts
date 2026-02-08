import type { CustomThemeConfig, Player, YBandAxis } from 'src/types'
import {
  getFunnelLightLabel,
  getLightColor,
  getLightColorLegend,
  getLightCrosshairLine,
  getLightCrosshairRect,
  getLightBrushConfig,
  getLightLabel,
  getLightLegend,
  getLightPivotChartGridConfig,
  getLightTableConfig,
  getLightPlayer,
} from '../common'
import { getLightTooltip } from '../common/tooltip'
import { getLightBandAxis, getLightLinearAxis } from '../common/axes'
import { getLightAnnotation } from '../common/annotaion'
import { getLightFunnelTransformTheme } from '../common/funnelTransform'
import { getLightHeatmapCellTheme } from '../common/heatmapCell'
import { getLightRegressionLine } from '../common/regressionLine'
import { getLightBoxPlotStyle, getLightOutlierStyle } from '../common/boxPlot'

export const lightTheme = (): CustomThemeConfig => {
  const linearAxis = getLightLinearAxis()
  const bandAxis: YBandAxis = getLightBandAxis()
  const barBandAxis: YBandAxis = {
    ...bandAxis,
    labelAutoHide: false,
    labelAutoHideGap: 1,
    labelAutoLimit: false,
    labelAutoLimitLength: undefined,
    labelAutoRotate: false,
    labelAutoRotateAngleRange: [0, -45, -90],
  }

  const crosshairLine = getLightCrosshairLine()
  const crosshairRect = getLightCrosshairRect()

  const baseConfig = {
    backgroundColor: 'transparent',
    color: getLightColor(),
    label: getLightLabel(),
    legend: getLightLegend(),
    tooltip: getLightTooltip(),
    brush: getLightBrushConfig(),
  }
  const tableConfig = getLightTableConfig()
  const player = getLightPlayer() as Player

  return {
    config: {
      // table
      table: tableConfig,
      pivotTable: tableConfig,
      // cartesian
      line: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairLine,
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      column: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect,

        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),

        regressionLine: getLightRegressionLine(),
      },
      columnParallel: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairRect,

        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      columnPercent: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: {
          ...linearAxis,
        },

        crosshairRect,
        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      bar: {
        ...baseConfig,
        xAxis: linearAxis,
        yAxis: barBandAxis,
        crosshairRect,

        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },

      barParallel: {
        ...baseConfig,
        xAxis: linearAxis,
        yAxis: barBandAxis,
        crosshairRect,
        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      barPercent: {
        ...baseConfig,
        xAxis: {
          ...linearAxis,
        },
        yAxis: barBandAxis,
        crosshairRect,

        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      area: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: linearAxis,
        crosshairLine,

        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      areaPercent: {
        ...baseConfig,
        xAxis: bandAxis,
        yAxis: {
          ...linearAxis,
        },

        crosshairLine,
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
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

        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),

        regressionLine: getLightRegressionLine(),
      },
      dualAxis: {
        ...baseConfig,
        xAxis: bandAxis,
        primaryYAxis: linearAxis,
        secondaryYAxis: { ...linearAxis, grid: { visible: false } },
        crosshairRect,
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
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

        pivotGrid: getLightPivotChartGridConfig(),
      },
      donut: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          labelLayout: 'arc',
          showDimension: true,
        },

        pivotGrid: getLightPivotChartGridConfig(),
      },
      radar: {
        ...baseConfig,

        pivotGrid: getLightPivotChartGridConfig(),
      },
      rose: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          showDimension: true,
        },

        pivotGrid: getLightPivotChartGridConfig(),
      },
      roseParallel: {
        ...baseConfig,
        label: {
          ...baseConfig.label,
          showValuePercent: true,
          showDimension: true,
        },

        pivotGrid: getLightPivotChartGridConfig(),
      },
      // other
      funnel: {
        ...baseConfig,
        label: getFunnelLightLabel(),
        transform: getLightFunnelTransformTheme(),

        pivotGrid: getLightPivotChartGridConfig(),
      },
      heatmap: {
        ...baseConfig,
        legend: getLightColorLegend(),
        xAxis: bandAxis,
        yAxis: bandAxis,
        label: {
          ...baseConfig.label,
          labelColorSmartInvert: true,
        },

        cell: getLightHeatmapCellTheme(),
        pivotGrid: getLightPivotChartGridConfig(),
      },
      histogram: {
        ...baseConfig,
        xAxis: linearAxis,
        yAxis: linearAxis,
        crosshairRect,
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
        regressionLine: getLightRegressionLine(),
      },
      boxPlot: {
        ...baseConfig,
        xAxis: linearAxis,
        yAxis: linearAxis,
        crosshairRect,
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),

        boxPlotStyle: getLightBoxPlotStyle(),
        outlierStyle: getLightOutlierStyle(),
      },

      // hierarchy
      treeMap: {
        ...baseConfig,
        pivotGrid: getLightPivotChartGridConfig(),
      },
      sunburst: {
        ...baseConfig,
        pivotGrid: getLightPivotChartGridConfig(),
      },
      circlePacking: {
        ...baseConfig,
        pivotGrid: getLightPivotChartGridConfig(),
      },

      // race
      raceBar: {
        ...baseConfig,
        legend: {
          ...baseConfig.legend,
          enable: false,
        },
        xAxis: {
          ...linearAxis,
          animation: {
            duration: player.interval,
            easing: 'linear',
          },
          nice: false,
        },
        yAxis: {
          ...barBandAxis,
          animation: {
            duration: player.interval ? player.interval * 0.6 : undefined,
            easing: 'cubicInOut',
          },
        },
        crosshairRect,
        player,

        stackCornerRadius: [0, 4, 4, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),
      },
      raceColumn: {
        ...baseConfig,
        legend: {
          ...baseConfig.legend,
          enable: false,
        },
        xAxis: {
          ...bandAxis,
          animation: {
            duration: player.interval ? player.interval * 0.6 : undefined,
            easing: 'cubicInOut',
          },
        },
        yAxis: {
          ...linearAxis,
          animation: {
            duration: player.interval,
            easing: 'linear',
          },
          nice: false,
        },
        crosshairRect,
        player,

        stackCornerRadius: [4, 4, 0, 0],
        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),

        regressionLine: getLightRegressionLine(),
      },
      raceScatter: {
        ...baseConfig,
        legend: {
          ...baseConfig.legend,
          enable: false,
        },
        crosshairLine,
        sizeRange: [8, 24],
        xAxis: {
          ...linearAxis,
          max: true,
          animation: {
            duration: player.interval ? player.interval * 0.6 : undefined,
            easing: 'cubicInOut',
          },
          line: {
            ...linearAxis.line,
            visible: true,
          },
        },
        yAxis: {
          ...linearAxis,
          max: true,
          animation: {
            duration: player.interval ? player.interval * 0.6 : undefined,
            easing: 'cubicInOut',
          },
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
        player,

        pivotGrid: getLightPivotChartGridConfig(),
        annotation: getLightAnnotation(),

        regressionLine: getLightRegressionLine(),
      },
    },
  }
}
