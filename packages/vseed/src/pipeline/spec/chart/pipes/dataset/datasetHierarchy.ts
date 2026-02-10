import { findAllMeasures } from 'src/pipeline/utils'
import type { VChartSpecPipe, Datum, FoldInfo, UnfoldInfo } from 'src/types'

export const datasetHierarchy: VChartSpecPipe = (spec, context) => {
  const result = { ...spec }
  const { advancedVSeed } = context
  const { datasetReshapeInfo, dataset, measures } = advancedVSeed
  const { foldInfo, unfoldInfo } = datasetReshapeInfo[0]

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
  const tree = buildTree(dataset, hierarchyFields, foldInfo, unfoldInfo, measureKeys)

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
  unfoldInfo: UnfoldInfo,
  measureKeys: string[] = [],
) => {
  const { measureValue, measureId, measureName } = foldInfo
  const { encodingColor, encodingColorId } = unfoldInfo

  // 统一管理需要 Set 收集 → join('+') 的字段
  const collectFields = [measureId, measureName, encodingColor, encodingColorId].filter(Boolean) as string[]

  const root: Datum = { name: 'root', children: [] }

  dataset.forEach((datum) => {
    let currentNode = root

    // 遍历层级字段，构建路径
    for (let i = 0; i < hierarchyFields.length; i++) {
      const field = hierarchyFields[i]
      const value = String(datum[field])

      let child = currentNode.children.find((c: Datum) => c.name === value)

      if (!child) {
        child = { name: value, children: [] }
        for (let j = 0; j <= i; j++) {
          child[hierarchyFields[j]] = datum[hierarchyFields[j]]
        }
        currentNode.children.push(child)
      }

      currentNode = child
    }

    // 叶子节点：首次访问时初始化
    if (!currentNode.isLeaf) {
      Object.assign(currentNode, datum)
      currentNode.isLeaf = true

      // 初始化数值累加器
      if (measureValue) currentNode[measureValue] = 0
      measureKeys.forEach((key) => {
        currentNode[key] = 0
      })

      // 初始化 Set 收集器
      collectFields.forEach((field) => {
        currentNode[`_set_${field}`] = new Set()
      })
    }

    // 聚合 measureValue
    if (measureValue && datum[measureValue] !== undefined) {
      currentNode[measureValue] += Number(datum[measureValue])
    }

    // 聚合各个 measure
    measureKeys.forEach((key) => {
      if (datum[key] !== undefined) {
        currentNode[key] = (currentNode[key] || 0) + Number(datum[key])
      }
    })

    // 收集需要 join 的字段值
    collectFields.forEach((field) => {
      if (datum[field]) currentNode[`_set_${field}`].add(datum[field])
    })

    // 更新 value 字段
    if (measureValue) {
      currentNode.value = currentNode[measureValue]
    }
  })

  // 将 Set 转为 '+' 拼接的字符串
  const flattenSets = (node: Datum) => {
    collectFields.forEach((field) => {
      const setKey = `_set_${field}`
      if (node[setKey]) {
        node[field] = Array.from(node[setKey]).join('+')
        delete node[setKey]
      }
    })
  }

  // 从子节点的 '+' 字符串中收集所有唯一值，合并到父节点
  const mergeCollectFieldsFromChildren = (node: Datum) => {
    collectFields.forEach((field) => {
      const merged = new Set<string>()
      node.children.forEach((child: Datum) => {
        if (child[field]) {
          child[field].split('+').forEach((v: string) => merged.add(v))
        }
      })
      if (merged.size > 0) {
        node[field] = Array.from(merged).join('+')
      }
    })
  }

  // 后序遍历：自底向上聚合
  const aggregate = (node: Datum): number => {
    if (node.isLeaf) {
      flattenSets(node)
      return node.value || 0
    }

    if (!node.children?.length) {
      return node.value || 0
    }

    let sum = 0
    node.children.forEach((child: Datum) => {
      sum += aggregate(child)
      measureKeys.forEach((key) => {
        node[key] = (node[key] || 0) + (child[key] || 0)
      })
    })

    node.value = sum
    if (measureValue) node[measureValue] = sum

    mergeCollectFieldsFromChildren(node)

    return sum
  }

  root.children.forEach(aggregate)

  return root.children
}
