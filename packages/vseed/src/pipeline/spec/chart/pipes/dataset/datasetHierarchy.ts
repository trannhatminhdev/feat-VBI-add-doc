import { findAllMeasures } from 'src/pipeline/utils'
import type { VChartSpecPipe, Datum, FoldInfo } from 'src/types'

export const datasetHierarchy: VChartSpecPipe = (spec, context) => {
  const result = { ...spec }
  const { advancedVSeed } = context
  const { datasetReshapeInfo, dataset, measures } = advancedVSeed
  const { foldInfo } = datasetReshapeInfo[0]

  // 1. 获取 hierarchy encoding 对应的字段
  // 在 advanced pipeline 中，encodingForHierarchy 已经确保了 dimensions 被正确映射到 'hierarchy' 通道
  const hierarchyFields = (advancedVSeed.encoding as Datum)?.hierarchy || []

  const measureKeys = findAllMeasures(measures).map((m) => m.id)

  // 2. 如果没有 hierarchy 字段，直接返回原始数据（虽然这可能导致图表无法正确渲染，但比报错好）
  if (!hierarchyFields.length) {
    result.data = [{ id: 'data', values: dataset }]
    return result
  }

  // 3. 构建树形结构
  const tree = buildTree(dataset, hierarchyFields, foldInfo, measureKeys)

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
 * @param measureIdField 指标ID字段名
 */
export const buildTree = (
  dataset: Datum[],
  hierarchyFields: string[],
  foldInfo: FoldInfo,
  measureKeys: string[] = [],
) => {
  const { measureValue, measureId, measureName } = foldInfo
  const root: Datum = { name: 'root', children: [] }

  dataset.forEach((datum) => {
    let currentNode = root

    // 遍历层级字段，构建路径
    for (let i = 0; i < hierarchyFields.length; i++) {
      const field = hierarchyFields[i]
      const value = String(datum[field]) // 确保值为字符串

      let child = currentNode.children.find((c: Datum) => c.name === value)

      if (!child) {
        child = { name: value, children: [] }
        // 确保父节点尽可能保留信息：保留当前层级及之前层级的所有维度字段
        for (let j = 0; j <= i; j++) {
          const key = hierarchyFields[j]
          child[key] = datum[key]
        }
        currentNode.children.push(child)
      }

      currentNode = child
    }

    // 叶子节点：聚合逻辑
    if (!currentNode.isLeaf) {
      // 第一次访问叶子节点：保留维度信息
      Object.assign(currentNode, datum)
      currentNode.isLeaf = true

      // 初始化累加器（防止后续叠加时使用了 datum 中的原始值作为初始值）
      if (measureValue) currentNode[measureValue] = 0
      measureKeys.forEach((key) => {
        currentNode[key] = 0
      })

      // 初始化 ID 集合用于后续 join
      currentNode._measureIds = new Set()
      currentNode._measureNames = new Set()
    }

    // 1. 聚合 measureValue (drawing measure)
    if (measureValue && datum[measureValue] !== undefined) {
      currentNode[measureValue] += Number(datum[measureValue])
    }

    // 2. 聚合各个 measure
    // 原来的逻辑：只聚合当前 measureId 对应的 measure，导致其他 measure（如 profit）在 folded 后的行中被忽略
    // const currentMeasureId = datum[measureId]
    // const currentMeasureValue = Number(datum[measureValue])
    // if (currentMeasureId && measureKeys.includes(currentMeasureId)) {
    //   currentNode[currentMeasureId] = (currentNode[currentMeasureId] || 0) + currentMeasureValue
    // }

    // 新的逻辑：遍历所有 measureKey，如果 datum 中存在该字段，则进行聚合
    measureKeys.forEach((key) => {
      if (datum[key] !== undefined) {
        currentNode[key] = (currentNode[key] || 0) + Number(datum[key])
      }
    })

    // 3. 收集 ID 和 Name 信息
    if (datum[measureId]) currentNode._measureIds.add(datum[measureId])
    if (datum[measureName]) currentNode._measureNames.add(datum[measureName])

    // 4. 更新 value 字段 (用于图表映射)
    if (measureValue) {
      currentNode.value = currentNode[measureValue]
    }
  })

  // 后序遍历：自底向上聚合 value
  const aggregate = (node: Datum) => {
    // 处理叶子节点的 ID 集合
    if (node.isLeaf) {
      if (measureId && node._measureIds) {
        node[measureId] = Array.from(node._measureIds).join('+')
        delete node._measureIds
      }
      if (measureName && node._measureNames) {
        node[measureName] = Array.from(node._measureNames).join('+')
        delete node._measureNames
      }
      return node.value || 0
    }

    if (node.children && node.children.length > 0) {
      // node.isLeaf = false // 已经是 false 或 undefined，不需要显式设为 false，除非...
      let sum = 0
      node.children.forEach((child: Datum) => {
        sum += aggregate(child)

        // 聚合子节点的各个 measure 值到父节点
        measureKeys.forEach((key) => {
          node[key] = (node[key] || 0) + (child[key] || 0)
        })
      })

      node.value = sum

      // 为中间节点补充 measureValue 字段，保证 Tooltip 能取到值
      if (measureValue) {
        node[measureValue] = sum
      }

      // 为中间节点补充 measureIdField 字段
      if (measureId && node.children[0]) {
        // 收集所有子节点的 measureId
        const childIds = new Set()
        node.children.forEach((child: Datum) => {
          if (child[measureId]) {
            child[measureId].split('+').forEach((id: string) => childIds.add(id))
          }
        })
        node[measureId] = Array.from(childIds).join('+')

        // 收集所有子节点的 measureName
        const childNames = new Set()
        node.children.forEach((child: Datum) => {
          if (child[measureName]) {
            child[measureName].split('+').forEach((name: string) => childNames.add(name))
          }
        })
        node[measureName] = Array.from(childNames).join('+')
      }

      return sum
    }
    // 应该是不会走到这里的，因为叶子节点在上面已经处理了
    return node.value || 0
  }

  root.children.forEach(aggregate)

  return root.children
}
