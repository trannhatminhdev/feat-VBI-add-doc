import type { PivotChartSpecPipeline, VChartSpecPipeline } from 'src/types'
import {
  initTreeMap,
  datasetHierarchy,
  color,
  linearColor,
  colorAdapter,
  backgroundColor,
  labelTreeMapLeaf,
  labelTreeMapGroup,
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
import { tooltipTreeMap } from '../pipes/tooltip/tooltipTreeMap'

const treeMap: VChartSpecPipeline = [
  initTreeMap,
  datasetHierarchy,
  colorAdapter(color, linearColor),
  backgroundColor,
  colorAdapter(discreteLegend, colorLegend),
  tooltipTreeMap,
  labelTreeMapLeaf,
  labelTreeMapGroup,
]

const pivotTreeMap: PivotChartSpecPipeline = [
  initPivot,
  pivotGridStyle,
  pivotIndicatorsAsRow,
  datasetPivot,
  pivotIndicators([
    initTreeMap,
    datasetHierarchy,
    colorAdapter(color, linearColor),
    backgroundColor,
    tooltipTreeMap,
    labelTreeMapLeaf,
    labelTreeMapGroup,
  ]),
  pivotRowDimensions,
  pivotColumnDimensions,
  pivotTitle,
  colorAdapter(pivotDiscreteLegend, pivotColorLegend),
]

export const treeMapSpecPipeline = [pivotAdapter(treeMap, pivotTreeMap)]
