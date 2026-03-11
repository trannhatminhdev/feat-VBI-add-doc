import type { ListTableConstructorOptions } from '@visactor/vtable'
import { createFormatterByDimension, isMeasure } from 'src/pipeline/utils'
import type { Datum, Dimension, DimensionGroup, DimensionTree, ListTableSpecPipe } from 'src/types'
import { treeTreeToColumns } from './utils'

export const dimensionTreeToColumns: ListTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const dimensionTree = (advancedVSeed as unknown as { dimensionTree: DimensionTree }).dimensionTree
  const result = { ...spec } as ListTableConstructorOptions
  const eachNode = (node: Dimension | DimensionGroup) => {
    if (isMeasure(node)) {
      return {
        width: 'auto',
        fieldFormat: (datum: Datum) => {
          const formatter = createFormatterByDimension(node as Dimension, advancedVSeed.locale)
          return formatter(datum[node.id] as string | number)
        },
      }
    }

    return {}
  }
  const columns = treeTreeToColumns<Dimension, DimensionGroup>(dimensionTree, eachNode)

  return {
    ...result,
    columns: [...(result.columns || []), ...columns] as ListTableConstructorOptions['columns'],
  }
}
