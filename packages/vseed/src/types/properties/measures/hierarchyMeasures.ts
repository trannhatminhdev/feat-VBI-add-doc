import type { BaseMeasure } from './baseMeasure'

export type HierarchyMeasure = BaseMeasure & {
  encoding?: 'size' | 'label' | 'tooltip'
}
