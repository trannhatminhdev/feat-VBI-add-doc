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
  sunburstConfig,
} from '../pipes'

export const sunburstAdvancedPipeline: AdvancedPipeline = [
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

  sunburstConfig,
  theme,
  annotation,
]
