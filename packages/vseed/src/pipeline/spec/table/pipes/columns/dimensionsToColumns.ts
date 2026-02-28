import type { ListTableConstructorOptions } from '@visactor/vtable'
import { isMeasure } from 'src/pipeline/utils'
import type { Dimension, DimensionGroup, DimensionTree, ListTableSpecPipe } from 'src/types'
import { treeTreeToColumns } from './utils'

export const dimensionTreeToColumns: ListTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const dimensionTree = (advancedVSeed as unknown as { dimensionTree: DimensionTree }).dimensionTree
  const result = { ...spec } as ListTableConstructorOptions
  const eachNode = (node: Dimension | DimensionGroup) => {
    if (isMeasure(node)) {
      return {
        width: 'auto',
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
