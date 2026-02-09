import { findAllMeasures } from 'src/pipeline/utils'
import type { PivotChartSpecPipe, Datum } from 'src/types'
import { buildTree } from './datasetHierarchy'
import { omit } from 'remeda'

export const datasetPivotHierarchy: PivotChartSpecPipe = (spec, context) => {
  const result = { ...spec }
  const { advancedVSeed } = context
  const { dataset, datasetReshapeInfo, measures } = advancedVSeed
  const measureKeys = findAllMeasures(measures).map((m) => m.id)

  const hierarchyFields = (advancedVSeed.encoding as Datum)?.hierarchy || []
  const rows = (advancedVSeed.encoding as Datum)?.row || []
  const columns = (advancedVSeed.encoding as Datum)?.column || []
  const pivotDims = [...rows, ...columns]
  const records = dataset.reduce(
    (pre, cur, index) => {
      const id = datasetReshapeInfo[index].id
      const { foldInfo, unfoldInfo } = datasetReshapeInfo[index]

      if (pivotDims.length > 0) {
        const groupedDataset = groupByDimensions(cur as Datum[], pivotDims) as Datum[]
        pre[id] = groupedDataset.flatMap((data) => {
          const root = {
            ...data,
            children: buildTree(data.children as Datum[], hierarchyFields, foldInfo, unfoldInfo, measureKeys),
          }
          const rootProps = omit(root, ['children'])
          const rootTree = root.children.map((child: Datum) => ({
            ...child,
            ...rootProps,
          }))
          return rootTree
        })
      } else {
        const tree = buildTree(cur as Datum[], hierarchyFields, foldInfo, unfoldInfo, measureKeys)
        pre[id] = tree
      }

      return pre
    },
    {} as Record<string, any>,
  )

  return {
    ...result,
    records: records,
  }
}

function groupByDimensions<T extends Record<string, any>>(data: T[], dimKeys: string[]): any[] {
  if (dimKeys.length === 0) {
    return data
  }

  // 用所有 dimKeys 的值拼接成复合 key
  const buckets = new Map<string, { dimValues: Record<string, any>; items: T[] }>()

  for (const item of data) {
    const compositeKey = dimKeys.map((k) => String(item[k])).join('\x00')

    if (!buckets.has(compositeKey)) {
      const dimValues: Record<string, any> = {}
      for (const k of dimKeys) {
        dimValues[k] = item[k]
      }
      buckets.set(compositeKey, { dimValues, items: [] })
    }
    buckets.get(compositeKey)!.items.push(item)
  }

  const result: any[] = []
  // @ts-expect-error 忽略类型检查
  for (const [, { dimValues, items }] of buckets) {
    result.push({
      ...dimValues, // 平铺所有维度 key:value
      children: items,
    })
  }

  return result
}
