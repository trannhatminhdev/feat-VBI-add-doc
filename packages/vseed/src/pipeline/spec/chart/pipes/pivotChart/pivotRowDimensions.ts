import type { PivotChartConstructorOptions } from '@visactor/vtable'
import { FoldYMeasureId } from 'src/dataReshape/constant'
import { createFormatterByDimension } from 'src/pipeline/utils'
import type { Dimensions, PivotChartSpecPipe } from 'src/types'

export const pivotRowDimensions: PivotChartSpecPipe = (spec, context) => {
  const result = { ...spec } as PivotChartConstructorOptions
  const { advancedVSeed } = context
  const dimensions = advancedVSeed.dimensions as Dimensions
  const measures = advancedVSeed.measures ?? []
  if (!dimensions) {
    return result
  }
  const rowDimensions = dimensions.filter((dim) => dim.encoding === 'row')
  const rows = rowDimensions.map((dim) => {
    const baseConfig: any = {
      dimensionKey: dim.id,
      title: dim.alias ?? dim.id,
    }

    if (dim.id === FoldYMeasureId) {
      baseConfig.headerFormat = (title: string) => {
        const measure = measures.find((m) => m.id === title)

        return measure ? (measure.alias ?? measure.id) : title
      }
    } else if (dim.timeFormat) {
      const formatter = createFormatterByDimension(dim, advancedVSeed.locale)
      baseConfig.headerFormat = (value: string | number) => formatter(value)
    }

    return baseConfig
  }) as unknown
  return {
    ...result,
    rows: rows,
  } as Partial<PivotChartConstructorOptions>
}
