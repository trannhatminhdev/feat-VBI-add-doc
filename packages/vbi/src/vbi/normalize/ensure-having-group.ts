import * as Y from 'yjs'
import { createHavingGroup } from 'src/builder/features/havingFilter/having-utils'
import { ensureYArray } from './ensure-y-array'
import type { FilterGroupInput } from './types'

const getDefaultHavingFilter = (): FilterGroupInput => {
  return {
    id: 'root',
    op: 'and',
    conditions: [],
  }
}

const isFilterGroupInput = (value: unknown): value is FilterGroupInput => {
  return typeof value === 'object' && value !== null
}

export const ensureHavingGroup = (havingFilter?: unknown): Y.Map<any> => {
  const sourceHavingFilter =
    havingFilter instanceof Y.Map || isFilterGroupInput(havingFilter) ? havingFilter : getDefaultHavingFilter()
  const havingGroup = sourceHavingFilter instanceof Y.Map ? sourceHavingFilter : createHavingGroup()

  if (sourceHavingFilter instanceof Y.Map) {
    if (!(havingGroup.get('conditions') instanceof Y.Array)) {
      havingGroup.set('conditions', new Y.Array<any>())
    }
    if (!havingGroup.get('id')) {
      havingGroup.set('id', 'root')
    }
    if (!havingGroup.get('op')) {
      havingGroup.set('op', 'and')
    }
    return havingGroup
  }

  havingGroup.set('id', sourceHavingFilter.id ?? 'root')
  havingGroup.set('op', sourceHavingFilter.op ?? 'and')
  havingGroup.set('conditions', ensureYArray(sourceHavingFilter.conditions, true))

  return havingGroup
}
