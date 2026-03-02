import type { PivotTableSpecPipe } from 'src/types'

export const titleOnDimension: PivotTableSpecPipe = (spec) => {
  return {
    ...spec,
    corner: {
      titleOnDimension: 'row',
    },
  }
}
