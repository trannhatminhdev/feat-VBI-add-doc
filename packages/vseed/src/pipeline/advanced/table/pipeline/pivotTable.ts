import type { AdvancedPipeline } from 'src/types'
import { theme } from '../../chart/pipes'
import {
  cellStyle,
  defaultDimensions,
  defaultMeasures,
  encodingForPivotTable,
  initAdvancedVSeed,
  page,
  pivotTableConfig,
  records,
} from '../pipes'

export const pivotTableAdvancedPipeline: AdvancedPipeline = [
  page,
  initAdvancedVSeed,
  defaultMeasures,
  defaultDimensions,
  cellStyle,

  encodingForPivotTable,
  records,
  pivotTableConfig,
  theme,
]
