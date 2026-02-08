import type { PivotChartSpecPipeline, VChartSpecPipeline } from 'src/types'
import {
  initCirclePacking,
  datasetHierarchy,
  color,
  linearColor,
  colorAdapter,
  backgroundColor,
  tooltipCirclePacking,
  labelCirclePacking,
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

const circlePacking: VChartSpecPipeline = [
  initCirclePacking,
  datasetHierarchy,
  colorAdapter(color, linearColor),
  backgroundColor,
  colorAdapter(discreteLegend, colorLegend),
  tooltipCirclePacking,
  labelCirclePacking,
]

const pivotCirclePacking: PivotChartSpecPipeline = [
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsRow,
  datasetPivot,
  pivotIndicators([
    initCirclePacking,
    datasetHierarchy,
    colorAdapter(color, linearColor),
    backgroundColor,
    tooltipCirclePacking,
    labelCirclePacking,
  ]),
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  colorAdapter(pivotDiscreteLegend, pivotColorLegend),
]

export const circlePackingSpecPipeline = [pivotAdapter(circlePacking, pivotCirclePacking)]
