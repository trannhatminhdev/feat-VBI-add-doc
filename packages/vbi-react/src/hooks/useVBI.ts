import { useMemo } from 'react'
import type { VBIDSL, VBIBuilder } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export interface UseVBIReturn {
  builder: VBIBuilder
  dsl: VBIDSL
}

export function useVBI(builder: VBIBuilder): UseVBIReturn {
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
  const dsl = useMemo(() => JSON.parse(serializedDsl) as VBIDSL, [serializedDsl])

  return { builder, dsl }
}
