import type { ColumnsDefine } from '@visactor/vtable'
import { findTreeNodesBy } from 'src/pipeline/utils'

/**
 * 从树形结构中提取所有叶子节点的ID
 */
export function extractLeafIds<T extends { id: string }>(tree: T[]): Set<string> {
  const leafNodes = findTreeNodesBy(tree, () => true)
  return new Set(leafNodes.map((node) => node.id))
}

export const treeTreeToColumns = <T extends object, U extends { children?: (T | U)[] }>(
  tree: (T | U)[],
  callback?: (node: T | U) => object,
): ColumnsDefine[] => {
  const result = tree.map((item) => {
    const props = callback?.(item) || {}

    if ('children' in item && Array.isArray(item.children)) {
      return {
        ...props,
        columns: treeTreeToColumns(item.children, callback),
      }
    }

    return props
  }) as unknown as ColumnsDefine[]

  return result || []
}
