import { useMemo } from 'react'
import type { VBIMeasure, VBIChartBuilder } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export type UseMeasuresConfig = Partial<Pick<VBIMeasure, 'aggregate' | 'alias' | 'encoding'>>

export interface UseMeasuresReturn {
  addMeasure: (field: string, config?: UseMeasuresConfig) => void
  measures: VBIMeasure[]
  removeMeasure: (id: string) => void
  updateMeasure: (id: string, config: UseMeasuresConfig) => void
}

export function useMeasures(builder: VBIChartBuilder): UseMeasuresReturn {
  const serializedMeasures = useBuilderObserver(
    (callback) => builder.measures.observe(() => callback()),
    () => JSON.stringify(builder.measures.toJSON()),
  )
  const measures = useMemo(() => JSON.parse(serializedMeasures) as VBIMeasure[], [serializedMeasures])

  return {
    addMeasure: (field, config = {}) => {
      builder.measures.add(field, (node) => {
        if (config.alias !== undefined) {
          node.setAlias(config.alias)
        }
        if (config.aggregate !== undefined) {
          node.setAggregate(config.aggregate)
        }
        if (config.encoding !== undefined) {
          node.setEncoding(config.encoding)
        }
      })
    },
    measures,
    removeMeasure: (id) => {
      builder.measures.remove(id)
    },
    updateMeasure: (id, config) => {
      builder.measures.update(id, (node) => {
        if (config.alias !== undefined) {
          node.setAlias(config.alias)
        }
        if (config.aggregate !== undefined) {
          node.setAggregate(config.aggregate)
        }
        if (config.encoding !== undefined) {
          node.setEncoding(config.encoding)
        }
      })
    },
  }
}
