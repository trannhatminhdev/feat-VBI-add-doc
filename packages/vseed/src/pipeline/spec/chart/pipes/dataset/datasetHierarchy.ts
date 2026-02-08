import type { VChartSpecPipe, Datum } from 'src/types'

export const datasetHierarchy: VChartSpecPipe = (spec, context) => {
  const result = { ...spec }
  const { advancedVSeed } = context
  const { datasetReshapeInfo, dataset } = advancedVSeed
  const { foldInfo } = datasetReshapeInfo[0]
  const { measureValue } = foldInfo

  // 1. 获取 hierarchy encoding 对应的字段
  // 在 advanced pipeline 中，encodingForHierarchy 已经确保了 dimensions 被正确映射到 'hierarchy' 通道
  const hierarchyFields = (advancedVSeed.encoding as any)?.hierarchy || []

  // 2. 如果没有 hierarchy 字段，直接返回原始数据（虽然这可能导致图表无法正确渲染，但比报错好）
  if (!hierarchyFields.length) {
    result.data = [{ id: 'data', values: dataset }]
    return result
  }

  // 3. 构建树形结构
  const tree = buildTree(dataset, hierarchyFields, measureValue)

  result.data = [
    {
      id: 'data',
      values: tree,
    },
  ]

  return result
}

/**
 * @description 将平铺的数据集构建为树形结构
 * @param dataset 平铺的数据集
 * @param hierarchyFields 层级字段列表
 * @param measureValueField 指标值字段名
 */
const buildTree = (dataset: Datum[], hierarchyFields: string[], measureValueField: string) => {
  const root: any = { name: 'root', children: [] }

  dataset.forEach((datum) => {
    let currentNode = root

    // 遍历层级字段，构建路径
    for (let i = 0; i < hierarchyFields.length; i++) {
      const field = hierarchyFields[i]
      const value = String(datum[field]) // 确保值为字符串

      let child = currentNode.children.find((c: any) => c.name === value)

      if (!child) {
        child = { name: value, children: [] }
        currentNode.children.push(child)
      }

      currentNode = child
    }

    // 叶子节点：附加原始数据的所有属性
    // 这样 Tooltip 和其他通道（如 Color）可以正常工作
    Object.assign(currentNode, datum)

    // 确保 value 字段存在，用于图表的大小映射
    if (measureValueField && datum[measureValueField] !== undefined) {
      currentNode.value = datum[measureValueField]
    }
  })

  return root.children
}
