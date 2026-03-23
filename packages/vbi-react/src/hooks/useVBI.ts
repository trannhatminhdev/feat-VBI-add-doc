import { useMemo } from 'react'
import type { VBIChartDSL, VBIChartBuilder } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export interface UseVBIReturn {
  builder: VBIChartBuilder
  dsl: VBIChartDSL
}

export function useVBI(builder: VBIChartBuilder): UseVBIReturn {
  const serializedDsl = useBuilderObserver(
    (callback) => {
      const handleUpdate = () => {
        callback()
      }

      builder.doc.on('update', handleUpdate)

      return () => {
        builder.doc.off('update', handleUpdate)
      }
    },
    () => JSON.stringify(builder.build()),
  )
  const dsl = useMemo(() => JSON.parse(serializedDsl) as VBIChartDSL, [serializedDsl])

  return { builder, dsl }
}
