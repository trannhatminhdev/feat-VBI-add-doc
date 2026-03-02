import type { PivotTableSpecPipe } from 'src/types'

export const titleOnDimension: PivotTableSpecPipe = (spec) => {
  const { rows = [], columns = [], indicatorsAsCol, indicators = [] } = spec
  const rowsLength = rows.length + (indicatorsAsCol ? 0 : indicators?.length > 0 ? 1 : 0)

  return {
    ...spec,
    corner: {
      titleOnDimension: rowsLength <= 1 && columns.length >= 1 ? 'column' : 'row',
    },
  }
}
