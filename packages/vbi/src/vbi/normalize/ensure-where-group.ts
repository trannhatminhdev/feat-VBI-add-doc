import * as Y from 'yjs'
import { createWhereGroup } from 'src/builder/features/whereFilter/where-utils'
import { ensureYArray } from './ensure-y-array'
import type { FilterGroupInput } from './types'

const getDefaultWhereFilter = (): FilterGroupInput => {
  return {
    id: 'root',
    op: 'and',
    conditions: [],
  }
}

const isFilterGroupInput = (value: unknown): value is FilterGroupInput => {
  return typeof value === 'object' && value !== null
}

export const ensureWhereGroup = (whereFilter?: unknown): Y.Map<any> => {
  const sourceWhereFilter =
    whereFilter instanceof Y.Map || isFilterGroupInput(whereFilter) ? whereFilter : getDefaultWhereFilter()
  const whereGroup = sourceWhereFilter instanceof Y.Map ? sourceWhereFilter : createWhereGroup()

  if (sourceWhereFilter instanceof Y.Map) {
    if (!(whereGroup.get('conditions') instanceof Y.Array)) {
      whereGroup.set('conditions', new Y.Array<any>())
    }
    if (!whereGroup.get('id')) {
      whereGroup.set('id', 'root')
    }
    if (!whereGroup.get('op')) {
      whereGroup.set('op', 'and')
    }
    return whereGroup
  }

  whereGroup.set('id', sourceWhereFilter.id ?? 'root')
  whereGroup.set('op', sourceWhereFilter.op ?? 'and')
  whereGroup.set('conditions', ensureYArray(sourceWhereFilter.conditions, true))

  return whereGroup
}
