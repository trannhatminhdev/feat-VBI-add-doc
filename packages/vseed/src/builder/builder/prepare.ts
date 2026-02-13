import type { ChartType } from 'src/types'
import { InnerRowIndex } from 'src/dataReshape'
import type { Builder } from './builder'
import { executeDynamicFilter, isDynamicFilter } from 'src/dataSelector/selector'
import type { DynamicFilter } from 'src/dataSelector/selector'

/** 支持动态过滤的keyPath 白名单 */
const dynamicFilterConfig: Partial<Record<ChartType, string[]>> = {
  table: ['bodyCellStyle'],
  pivotTable: ['bodyCellStyle'],
  bar: ['barStyle', 'annotationPoint', 'annotationVerticalLine'],
  barParallel: ['barStyle', 'annotationPoint', 'annotationVerticalLine'],
  barPercent: ['barStyle', 'annotationPoint', 'annotationVerticalLine'],
  column: ['barStyle', 'annotationPoint', 'annotationHorizontalLine'],
  columnParallel: ['barStyle', 'annotationPoint', 'annotationHorizontalLine'],
  columnPercent: ['barStyle', 'annotationPoint', 'annotationHorizontalLine'],
  line: ['lineStyle', 'pointStyle', 'annotationPoint', 'annotationHorizontalLine'],
  area: ['lineStyle', 'pointStyle', 'annotationPoint', 'annotationHorizontalLine'],
  areaPercent: ['lineStyle', 'pointStyle', 'annotationPoint', 'annotationHorizontalLine'],
  dualAxis: ['barStyle', 'lineStyle', 'pointStyle', 'annotationPoint', 'annotationHorizontalLine'],
  scatter: ['pointStyle', 'annotationPoint', 'annotationHorizontalLine', 'annotationVerticalLine'],
  histogram: ['annotationHorizontalLine'],
  boxPlot: ['annotationHorizontalLine'],
}

/**
 * 生成完整的 keyPath 配置
 * 对每个基路径生成数组和非数组两种形式
 */
const generateDynamicFilterKeyPaths = (): Partial<Record<ChartType, string[]>> => {
  const result: Partial<Record<ChartType, string[]>> = {}
  for (const [chartType, baseKeyPaths] of Object.entries(dynamicFilterConfig)) {
    result[chartType as ChartType] = baseKeyPaths.flatMap((basePath) => [
      `${basePath}[].dynamicFilter`,
      `${basePath}.dynamicFilter`,
    ])
  }
  return result
}

const dynamicFilterKeyPathsByChartType = generateDynamicFilterKeyPaths()

/**
 * 提取图表类型对应的基础路径（用于深拷贝）
 */
const getBasePathsForDeepClone = (chartType: ChartType): string[] => {
  return dynamicFilterConfig[chartType] ?? []
}

const parseKeyPath = (path: string) => {
  return path.split('.').map((segment) => {
    if (segment.endsWith('[]')) {
      return { key: segment.slice(0, -2), isArray: true }
    }
    return { key: segment, isArray: false }
  })
}

const getValuesByKeyPath = (target: unknown, path: string): unknown[] => {
  const segments = parseKeyPath(path)
  let current: unknown[] = [target]

  for (const segment of segments) {
    const next: unknown[] = []
    for (const node of current) {
      if (!node || typeof node !== 'object') continue
      const value = (node as Record<string, unknown>)[segment.key]
      if (segment.isArray) {
        if (Array.isArray(value)) {
          next.push(...value)
        }
      } else if (value !== undefined) {
        next.push(value)
      }
    }
    current = next
  }

  return current
}

const collectDynamicFiltersByKeyPaths = (target: unknown, chartType: ChartType): DynamicFilter[] => {
  const paths = dynamicFilterKeyPathsByChartType[chartType] ?? []
  if (!paths.length) return []

  return paths
    .flatMap((path) => getValuesByKeyPath(target, path))
    .filter((value): value is DynamicFilter => isDynamicFilter(value) && !!value?.code)
}
/**
 * 执行所有 dynamicFilter 的 code，将结果直接写入 filter.result
 */
const executeDynamicFiltersAndInject = async (filters: DynamicFilter[], dataset: any[]): Promise<void> => {
  if (!filters.length || !dataset.length) return

  await Promise.all(
    filters.map(async (filter) => {
      const { success, data, error } = await executeDynamicFilter(filter, dataset)
      filter.result = {
        success,
        error,
        data: data as any,
      }
    }),
  )
}

/**
 * 针对性深拷贝 vseed 中包含 dynamicFilter 的路径
 * @description 只深拷贝需要修改的路径，避免完全深拷贝的性能开销
 */
const deepCloneDynamicFilterPaths = (vseed: any, chartType: ChartType): any => {
  const basePaths = getBasePathsForDeepClone(chartType)
  if (!basePaths.length) return { ...vseed }

  const clonedVseed = { ...vseed }

  for (const basePath of basePaths) {
    if (!(basePath in clonedVseed)) continue

    const value = clonedVseed[basePath]

    // 如果是数组，深拷贝数组及其元素
    if (Array.isArray(value)) {
      clonedVseed[basePath] = value.map((item) => {
        if (!item || typeof item !== 'object') return item

        const clonedItem = { ...item }

        // 如果有 dynamicFilter，深拷贝它
        if (clonedItem.dynamicFilter && typeof clonedItem.dynamicFilter === 'object') {
          clonedItem.dynamicFilter = { ...clonedItem.dynamicFilter }
        }

        return clonedItem
      })
    }
    // 如果是对象
    else if (value && typeof value === 'object') {
      clonedVseed[basePath] = { ...value }

      // 如果有 dynamicFilter，深拷贝它
      if (clonedVseed[basePath].dynamicFilter && typeof clonedVseed[basePath].dynamicFilter === 'object') {
        clonedVseed[basePath].dynamicFilter = { ...clonedVseed[basePath].dynamicFilter }
      }
    }
  }

  return clonedVseed
}

/**
 * 准备阶段 - 执行动态过滤器代码
 * @description 在 build() 之前调用，用于：
 *   1. 检查是否存在需要执行的 dynamicFilter (有 code 字段)
 *   2. 创建 vseed 的副本，给 dataset 添加 __row_index
 *   3. 收集所有 dynamicFilter 并执行 code
 *   4. 将结果直接写入 dynamicFilter.result
 *   5. 更新 builder.vseed 为处理后的副本
 * @returns Promise<void>
 */
export const prepare = async (builder: Builder): Promise<void> => {
  // 幂等性：如果已经准备过，直接返回
  if (builder.isPrepared || !builder.vseed || !builder.vseed?.chartType || !builder.vseed.dataset) {
    return
  }

  // 1. 收集原始 vseed 中的所有 dynamicFilter
  const filters = collectDynamicFiltersByKeyPaths(builder.vseed, builder.vseed.chartType)
  if (!filters.length) {
    // 标记为已准备（虽然实际没做什么）
    builder.isPrepared = true
    return
  }

  // 2. 针对性深拷贝 vseed（只拷贝包含 dynamicFilter 的路径）
  const clonedVseed = deepCloneDynamicFilterPaths(builder.vseed, builder.vseed.chartType)

  // 3. 创建带 __row_index 的 dataset
  const originalDataset = clonedVseed.dataset as any[]
  let datasetWithIndex = originalDataset

  // 如果还没有注入 __row_index，创建新的副本
  if (!originalDataset[0] || !(InnerRowIndex in originalDataset[0])) {
    datasetWithIndex = originalDataset.map((item, index) => ({
      ...item,
      [InnerRowIndex]: index,
    }))
  }

  // 4. 更新 builder.vseed，使用深拷贝后的 vseed 和带 __row_index 的 dataset
  builder.vseed = {
    ...clonedVseed,
    dataset: datasetWithIndex,
  }

  // 5. 重新收集 dynamicFilter（从新的 vseed 中）
  const clonedFilters = collectDynamicFiltersByKeyPaths(builder.vseed, builder.vseed.chartType)

  // 6. 执行所有 dynamicFilter 的 code，结果直接写入 filter.result
  try {
    await executeDynamicFiltersAndInject(clonedFilters, datasetWithIndex)
  } catch (e) {
    throw new Error(`Failed to execute dynamic filters: ${(e as Error).message}`)
  }

  // 7. 标记为已准备
  builder.isPrepared = true
}
