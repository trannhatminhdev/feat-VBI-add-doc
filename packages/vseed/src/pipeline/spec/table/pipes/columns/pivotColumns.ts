import type { PivotTableConstructorOptions } from '@visactor/vtable'
import { MeasureId } from 'src/dataReshape'
import { findAllMeasures } from 'src/pipeline/utils'
import type { Dimensions, PivotTableSpecPipe } from 'src/types'

export const pivotColumns: PivotTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { encoding } = advancedVSeed
  const dimensions = advancedVSeed.dimensionTree as Dimensions
  const columns = dimensions.filter((item) => encoding.column?.includes(item.id))
  const allMeasures = findAllMeasures(advancedVSeed.measureTree)

  return {
    ...spec,
    columns: columns.map((item) => {
      const res = {
        dimensionKey: item.id,
        title: item.alias || item.id,
        width: 'auto',
      }
      if (item.id === MeasureId) {
        ;(res as any).headerFormat = (measureId: string) => {
          const measure = allMeasures.find((m) => m.id === measureId)

          return measure?.alias ?? measureId
        }
      }

      return res
    }),
  } as PivotTableConstructorOptions
}
