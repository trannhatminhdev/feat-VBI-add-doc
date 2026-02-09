import type { Spec, ChartType, AdvancedVSeed } from 'src/types'
import { InnerRowIndex, ORIGINAL_DATA } from 'src/dataReshape'
import type { Builder } from './builder'
import { executeDynamicFilter, isDynamicFilter, isRowWithFieldDynamicFilter } from 'src/dataSelector/selector'
import type { DynamicFilter } from 'src/dataSelector/selector'
import type { ChartDynamicFilterRes, TableDynamicFilterRes } from 'src/types/dataSelector'
import { buildSpec } from './buildSpec'

export const buildAsync = async (builder: Builder): Promise<Spec> => {
  const originalVseed = builder.vseed
  const originalDataset = originalVseed.dataset as any[]

  const datasetWithIndex = (originalDataset ?? []).map((item, index) => ({
    ...item,
    [InnerRowIndex]: index,
  }))

  // 创建新的 vseed 副本，替换 dataset
  const vseedWithIndex = {
    ...originalVseed,
    dataset: datasetWithIndex,
  }

  // 临时设置到 builder
  builder.vseed = vseedWithIndex

  const advancedVSeed = builder.buildAdvanced()

  // 恢复原始 vseed，避免污染
  builder.vseed = originalVseed

  if (!advancedVSeed) {
    throw new Error('advancedVSeed is null')
  }

  const spec = await builder.buildSpecAsync(advancedVSeed)
  return spec
}

/**
 * 生成完整的 keyPath 配置
 * 对每个基路径生成数组和非数组两种形式
 */
const generateDynamicFilterKeyPaths = (): Partial<Record<ChartType, string[]>> => {
  /**
   * 动态筛选器基础配置 - 配置每个图表类型中可能包含动态筛选器的字段
   * 生成时会自动添加 [] 和非 [] 两种形式
   */
  const dynamicFilterConfig: Partial<Record<ChartType, string[]>> = {
    table: ['cellStyle.bodyCellStyle'],
    pivotTable: ['cellStyle.bodyCellStyle'],
    bar: ['markStyle.barStyle'],
    barParallel: ['markStyle.barStyle'],
    barPercent: ['markStyle.barStyle'],
    column: ['markStyle.barStyle'],
    columnParallel: ['markStyle.barStyle'],
    columnPercent: ['markStyle.barStyle'],
    line: ['markStyle.lineStyle', 'markStyle.pointStyle'],
    area: ['markStyle.lineStyle', 'markStyle.pointStyle'],
    areaPercent: ['markStyle.lineStyle', 'markStyle.pointStyle'],
    dualAxis: ['markStyle.barStyle', 'markStyle.lineStyle', 'markStyle.pointStyle'],
    // TODO: annotationPoint, annotationLine 后续补充
  }

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
    .filter((value): value is DynamicFilter => isDynamicFilter(value))
}

const hydrateDynamicFilters = async (advancedVSeed: AdvancedVSeed, chartType: ChartType): Promise<void> => {
  const filters = collectDynamicFiltersByKeyPaths(advancedVSeed, chartType)
  if (!filters.length) return

  const allData = (advancedVSeed.dataset ?? []).map((item) => (item?.[ORIGINAL_DATA] ? item[ORIGINAL_DATA] : item))
  await Promise.all(
    filters.map(async (filter) => {
      const { success, data } = await executeDynamicFilter(filter, allData)
      if (isRowWithFieldDynamicFilter(filter)) {
        filter.result = {
          success,
          data: data as TableDynamicFilterRes[],
        }
      } else {
        filter.result = {
          success,
          data: data as ChartDynamicFilterRes[],
        }
      }
    }),
  )
}

export const buildSpecAsync = async (builder: Builder, advancedVSeed: AdvancedVSeed): Promise<Spec> => {
  const { chartType } = builder.vseed

  try {
    // 执行 dynamicFilter，此时 dataset 已包含 InnerRowIndex
    await hydrateDynamicFilters(advancedVSeed, chartType)
  } catch (e) {
    throw new Error(`execute dynamic filters error: ${(e as Error).message}`)
  }
  return buildSpec(builder, advancedVSeed)
}
