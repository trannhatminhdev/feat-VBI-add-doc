import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'

export const buildHaving: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const havingFilters = vbiDSL.havingFilters || []

  if (havingFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.having = {
    op: 'and',
    conditions: havingFilters.map((filter) => {
      const mappedOp = filter.operator ?? '='
      return {
        field: filter.field,
        op: mappedOp,
        value: filter.value,
      }
    }),
  }

  return result as VQueryDSL
}
