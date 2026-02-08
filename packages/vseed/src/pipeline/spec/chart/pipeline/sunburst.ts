import type { PivotChartSpecPipeline, VChartSpecPipeline } from 'src/types'
import {
  initSunburst,
  datasetHierarchy,
  color,
  linearColor,
  colorAdapter,
  backgroundColor,
  tooltipHierarchy,
  labelSunburst,
  discreteLegend,
  colorLegend,
  pivotAdapter,
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsRow,
  datasetPivot,
  pivotIndicators,
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  pivotDiscreteLegend,
  pivotColorLegend,
} from '../pipes'

const sunburst: VChartSpecPipeline = [
  initSunburst,
  datasetHierarchy,
  colorAdapter(color, linearColor),
  backgroundColor,
  colorAdapter(discreteLegend, colorLegend),
  tooltipHierarchy,
  labelSunburst,
]

const pivotSunburst: PivotChartSpecPipeline = [
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsRow,
  datasetPivot,
  pivotIndicators([
    initSunburst,
    datasetHierarchy,
    colorAdapter(color, linearColor),
    backgroundColor,
    tooltipHierarchy,
    labelSunburst,
  ]),
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  colorAdapter(pivotDiscreteLegend, pivotColorLegend),
]

export const sunburstSpecPipeline = [pivotAdapter(sunburst, pivotSunburst)]
