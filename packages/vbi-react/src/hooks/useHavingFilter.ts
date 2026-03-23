import { useMemo } from 'react'
import type { HavingFilterBuilder, VBIChartBuilder, VBIHavingGroup } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export type UseHavingFilterMutation = (havingFilter: HavingFilterBuilder) => void

export interface UseHavingFilterReturn {
  clearHavingFilter: () => void
  havingFilter: VBIHavingGroup
  mutateHavingFilter: (mutation: UseHavingFilterMutation) => void
  removeHavingEntry: (idOrIndex: string | number) => void
}

export function useHavingFilter(builder: VBIChartBuilder): UseHavingFilterReturn {
  const serializedHavingFilter = useBuilderObserver(
    (callback) => builder.havingFilter.observe(() => callback()),
    () => JSON.stringify(builder.havingFilter.toJSON()),
  )
  const havingFilter = useMemo(() => JSON.parse(serializedHavingFilter) as VBIHavingGroup, [serializedHavingFilter])

  return {
    clearHavingFilter: () => {
      builder.havingFilter.clear()
    },
    havingFilter,
    mutateHavingFilter: (mutation) => {
      mutation(builder.havingFilter)
    },
    removeHavingEntry: (idOrIndex) => {
      builder.havingFilter.remove(idOrIndex)
    },
  }
}
