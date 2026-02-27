import type { ColumnsDefine } from '@visactor/vtable'
import { findTreeNodesBy } from 'src/pipeline/utils'

/**
 * 从树形结构中提取所有叶子节点的ID
 */
export function extractLeafIds<T extends { id: string }>(tree: T[]): Set<string> {
  const leafNodes = findTreeNodesBy(tree, () => true)
  return new Set(leafNodes.map((node) => node.id))
}

export const treeTreeToColumns = <
  T extends { id: string; alias?: string },
  U extends { id: string; alias?: string; children?: (T | U)[] },
>(
  tree: (T | U)[],
  callback?: (node: T | U) => object,
): ColumnsDefine[] => {
  const result = tree.map((item) => {
    if ('children' in item && Array.isArray(item.children)) {
      const groupNode = item as unknown as U
      const field = groupNode.id
      const title = groupNode.alias ?? groupNode.id
      const props = callback?.(groupNode) || {}
      // group
      return {
        field,
        title,
        columns: treeTreeToColumns(item.children, callback),
        ...props,
      }
    } else {
      const field = item.id
      const title = item.alias ?? item.id
      const props = callback?.(item) || {}
      // leaf
      return {
        field,
        title,
        ...props,
      }
    }
  }) as unknown as ColumnsDefine[]

  return result || []
}
