import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import type { VBIHavingFilter, VBIHavingClause, VBIHavingGroup } from '../../types'

export const buildHaving: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const havingFilter = vbiDSL.havingFilter

  if (!havingFilter || havingFilter.conditions.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.having = {
    op: havingFilter.op,
    conditions: havingFilter.conditions.flatMap(mapClauseToCondition),
  }

  return result as VQueryDSL
}

function isHavingGroup(clause: VBIHavingClause): clause is VBIHavingGroup {
  return 'op' in clause && 'conditions' in clause
}

function mapClauseToCondition(clause: VBIHavingClause): any[] {
  if (isHavingGroup(clause)) {
    return [mapGroupToCondition(clause)]
  }
  return mapFilterToCondition(clause)
}

function mapGroupToCondition(group: VBIHavingGroup): any {
  return {
    op: group.op,
    conditions: group.conditions.flatMap(mapClauseToCondition),
  }
}

function mapFilterToCondition(filter: VBIHavingFilter): any[] {
  const mappedOp = filter.op ?? '='
  return [
    {
      field: filter.field,
      op: mappedOp,
      value: filter.value,
    },
  ] as any[]
}
