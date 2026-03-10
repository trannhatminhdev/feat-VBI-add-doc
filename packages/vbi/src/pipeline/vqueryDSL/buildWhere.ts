import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import type { VBIFilter } from '../../types'

export const buildWhere: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const whereFilters = vbiDSL.whereFilters || []

  if (whereFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.where = {
    op: 'and',
    conditions: whereFilters.flatMap(mapFilterToCondition),
  }

  return result as VQueryDSL
}

function mapFilterToCondition(filter: VBIFilter): any[] {
  if (filter.operator === 'between') {
    return handleBetweenFilter(filter)
  }
  return handleSimpleFilter(filter)
}

function handleBetweenFilter(filter: VBIFilter): any[] {
  const conditions: any[] = []
  const value = filter.value as { min?: unknown; max?: unknown; leftOp?: string; rightOp?: string }

  if (value.min !== undefined && value.min !== null && value.min !== '') {
    conditions.push({
      field: filter.field,
      op: value.leftOp === '<' ? '>' : '>=',
      value: value.min,
    })
  }
  if (value.max !== undefined && value.max !== null && value.max !== '') {
    conditions.push({
      field: filter.field,
      op: value.rightOp === '<' ? '<' : '<=',
      value: value.max,
    })
  }
  return conditions
}

function handleSimpleFilter(filter: VBIFilter): any[] {
  let mappedOp = filter.operator ?? '='
  const value = filter.value

  if (Array.isArray(value)) {
    if (mappedOp === '=') mappedOp = 'in'
    if (mappedOp === '!=') mappedOp = 'not in'
  }

  return [
    {
      field: filter.field,
      op: mappedOp,
      value,
    },
  ] as any[]
}
