import type { PivotChartSpecPipeline, VChartSpecPipeline } from 'src/types'
import {
  initCirclePacking,
  datasetHierarchy,
  color,
  linearColor,
  colorAdapter,
  backgroundColor,
  tooltipHierarchy,
  labelCirclePacking,
  discreteLegend,
  colorLegend,
  pivotAdapter,
  initPivot,
  pivotGridStyle,
  pivotIndicators,
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  pivotDiscreteLegend,
  pivotColorLegend,
  pivotIndicatorsAsCol,
  pivotHideIndicatorName,
  datasetPivotHierarchy,
  drill,
  fontFamilyTheme,
} from '../pipes'

const circlePacking: VChartSpecPipeline = [
  fontFamilyTheme,
  initCirclePacking,
  drill,
  datasetHierarchy,
  colorAdapter(color, linearColor),
  backgroundColor,
  colorAdapter(discreteLegend, colorLegend),
  tooltipHierarchy,
  labelCirclePacking,
]

const pivotCirclePacking: PivotChartSpecPipeline = [
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsCol,
  pivotHideIndicatorName,
  datasetPivotHierarchy,
  pivotIndicators([
    fontFamilyTheme,
    initCirclePacking,
    datasetHierarchy,
    colorAdapter(color, linearColor),
    backgroundColor,
    tooltipHierarchy,
    labelCirclePacking,
  ]),
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  colorAdapter(pivotDiscreteLegend, pivotColorLegend),
]

export const circlePackingSpecPipeline = [pivotAdapter(circlePacking, pivotCirclePacking)]
