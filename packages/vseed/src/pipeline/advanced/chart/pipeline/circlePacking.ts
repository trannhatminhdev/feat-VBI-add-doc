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
  circlePackingConfig,
} from '../pipes'

export const circlePackingAdvancedPipeline: AdvancedPipeline = [
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

  circlePackingConfig,
  theme,
  annotation,
]
