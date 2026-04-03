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

const sunburst: VChartSpecPipeline = [
  fontFamilyTheme,
  initSunburst,
  drill,
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
  pivotIndicatorsAsCol,
  pivotHideIndicatorName,
  datasetPivotHierarchy,
  pivotIndicators([
    fontFamilyTheme,
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
