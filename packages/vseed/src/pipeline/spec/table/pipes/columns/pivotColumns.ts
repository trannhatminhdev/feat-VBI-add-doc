import type { PivotTableConstructorOptions } from '@visactor/vtable'
import type { Dimensions, PivotTableSpecPipe } from 'src/types'
import { createFormatterByDimension } from 'src/pipeline/utils'

export const pivotColumns: PivotTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { encoding } = advancedVSeed
  const dimensions = advancedVSeed.dimensionTree as Dimensions
  const columns = dimensions.filter((item) => encoding.column?.includes(item.id))

  return {
    ...spec,
    columns: columns.map((item) => {
      const formatter = createFormatterByDimension(item, advancedVSeed.locale)
      return {
        dimensionKey: item.id,
        title: item.alias || item.id,
        width: 'auto',
        headerStyle: {
          textAlign: 'right',
        },
        headerFormat: (value: string | number) => formatter(value),
      }
    }),
  } as PivotTableConstructorOptions
}
