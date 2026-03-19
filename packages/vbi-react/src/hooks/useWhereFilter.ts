import { useMemo } from 'react'
import type { VBIBuilder, VBIWhereGroup, WhereFilterBuilder } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export type UseWhereFilterMutation = (whereFilter: WhereFilterBuilder) => void

export interface UseWhereFilterReturn {
  clearWhereFilter: () => void
  mutateWhereFilter: (mutation: UseWhereFilterMutation) => void
  removeWhereEntry: (idOrIndex: string | number) => void
  whereFilter: VBIWhereGroup
}

export function useWhereFilter(builder: VBIBuilder): UseWhereFilterReturn {
  const serializedWhereFilter = useBuilderObserver(
    (callback) => builder.whereFilter.observe(() => callback()),
    () => JSON.stringify(builder.whereFilter.toJSON()),
  )
  const whereFilter = useMemo(() => JSON.parse(serializedWhereFilter) as VBIWhereGroup, [serializedWhereFilter])

  return {
    clearWhereFilter: () => {
      builder.whereFilter.clear()
    },
    mutateWhereFilter: (mutation) => {
      mutation(builder.whereFilter)
    },
    removeWhereEntry: (idOrIndex) => {
      builder.whereFilter.remove(idOrIndex)
    },
    whereFilter,
  }
}
