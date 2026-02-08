import type { PivotChartSpecPipeline, VChartSpecPipeline } from 'src/types'
import {
  initTreeMap,
  datasetHierarchy,
  color,
  linearColor,
  colorAdapter,
  backgroundColor,
  tooltip,
  label,
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

const treeMap: VChartSpecPipeline = [
  initTreeMap,
  datasetHierarchy,
  colorAdapter(color, linearColor),
  backgroundColor,
  colorAdapter(discreteLegend, colorLegend),
  tooltip,
  label,
]

const pivotTreeMap: PivotChartSpecPipeline = [
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsRow,
  datasetPivot,
  pivotIndicators([initTreeMap, datasetHierarchy, colorAdapter(color, linearColor), backgroundColor, tooltip, label]),
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  colorAdapter(pivotDiscreteLegend, pivotColorLegend),
]

export const treeMapSpecPipeline = [pivotAdapter(treeMap, pivotTreeMap)]
