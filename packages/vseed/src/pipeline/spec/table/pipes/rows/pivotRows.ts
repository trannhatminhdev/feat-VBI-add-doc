import type { Dimensions, PivotTableSpecPipe } from 'src/types'

export const pivotRows: PivotTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const dimensions = advancedVSeed.dimensionTree as Dimensions
  const { encoding } = advancedVSeed
  const rows = dimensions.filter((item) => encoding.row?.includes(item.id))

  return {
    ...spec,
    rows: rows.map((item) => {
      return {
        dimensionKey: item.id,
        title: item.alias || item.id,
        width: 'auto',
      }
    }),
  }
}
