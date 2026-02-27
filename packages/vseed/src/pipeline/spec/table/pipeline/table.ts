import type { SpecPipeline } from 'src/types'
import {
  initTable,
  dimensionTreeToColumns,
  measureTreeToColumns,
  columnsAggregation,
  bodyStyle,
  headerStyle,
  tableThemeStyle,
  selectionStyle,
  tableBodyCell,
} from '../pipes'

export const tableSpecPipeline: SpecPipeline = [
  initTable,
  dimensionTreeToColumns,
  measureTreeToColumns,
  columnsAggregation,
  bodyStyle,
  headerStyle,
  tableThemeStyle,
  selectionStyle,
  tableBodyCell,
]
