import type { AdvancedPipeline } from 'src/types'
import {
  initAdvancedVSeed,
  theme,
  pivotAdapter,
  annotation,
  reshapeWithEncoding,
  pivotReshapeWithEncoding,
  encodingForHierarchy,
  buildMeasures,
  defaultMeasures,
  defaultDimensions,
  defaultMeasureId,
  encodingAdapter,
  defaultEncodingForHierarchy,
  pickDimensionsForReshape,
  page,
  treeMapConfig,
} from '../pipes'

export const treeMapAdvancedPipeline: AdvancedPipeline = [
  page,
  initAdvancedVSeed,
  defaultMeasures,
  defaultDimensions,
  defaultMeasureId,

  encodingAdapter(
    [buildMeasures(['color', 'tooltip']), defaultEncodingForHierarchy],
    [buildMeasures(['color', 'tooltip']), encodingForHierarchy, pickDimensionsForReshape],
  ),
  pivotAdapter([reshapeWithEncoding], [pivotReshapeWithEncoding]),

  treeMapConfig,
  theme,
  annotation,
]
