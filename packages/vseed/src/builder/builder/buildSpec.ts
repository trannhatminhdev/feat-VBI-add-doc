import type { AdvancedVSeed, ChartType, Spec, SpecPipelineContext, VChartSpecPipeline } from 'src/types'
import { Builder } from './builder'
import { execPipeline } from '../../pipeline'
import { intl } from 'src/i18n'
import type { ISpec } from '@visactor/vchart'
import { executeDynamicFilter, isDynamicFilter, isTableDynamicFilter } from 'src/dataSelector/selector'
import type { DynamicFilter } from 'src/dataSelector/selector'
import type { ChartDynamicFilterRes, TableDynamicFilterRes } from 'src/types/dataSelector'

export const buildSpec = (builder: Builder, advancedVSeed: AdvancedVSeed): Spec => {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now()

  const { chartType } = builder.vseed

  const pipeline = Builder.getSpecPipeline(chartType)
  if (!pipeline) {
    throw new Error(
      `please invoke registerAll or register ${chartType} before build, no spec pipeline for chartType ${chartType}`,
    )
  }

  const context: SpecPipelineContext = {
    vseed: builder.vseed,
    advancedVSeed,
  }
  if (builder.locale) {
    intl.setLocale(builder.locale)
  }

  try {
    const spec = execPipeline<ISpec, SpecPipelineContext>(pipeline as VChartSpecPipeline, context)
    builder.spec = spec
    return spec
  } catch (e) {
    throw new Error(`buildSpec error: ${(e as Error).message}`)
  } finally {
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now()
    builder.performance['buildSpec'] = `${(end - start).toFixed(4)}ms`
  }
}

const dynamicFilterKeyPathsByChartType: Partial<Record<ChartType, string[]>> = {
  table: ['cellStyle.bodyCellStyle[].dynamicFilter'],
  pivotTable: ['cellStyle.bodyCellStyle[].dynamicFilter'],
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
    .filter((value): value is DynamicFilter => isDynamicFilter(value))
}

const hydrateDynamicFilters = async (advancedVSeed: AdvancedVSeed, chartType: ChartType): Promise<void> => {
  const filters = collectDynamicFiltersByKeyPaths(advancedVSeed, chartType)
  if (!filters.length) return

  const allData = advancedVSeed.dataset ?? []
  await Promise.all(
    filters.map(async (filter) => {
      const { success, data } = await executeDynamicFilter(filter, allData)
      if (isTableDynamicFilter(filter)) {
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
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now()

  const { chartType } = builder.vseed

  const pipeline = Builder.getSpecPipeline(chartType)
  if (!pipeline) {
    throw new Error(
      `please invoke registerAll or register ${chartType} before build, no spec pipeline for chartType ${chartType}`,
    )
  }

  if (builder.locale) {
    intl.setLocale(builder.locale)
  }

  try {
    // 执行 dynamicFilter，此时 dataset 已包含 InnerRowIndex
    await hydrateDynamicFilters(advancedVSeed, chartType)

    const context: SpecPipelineContext = {
      vseed: builder.vseed,
      advancedVSeed,
    }

    const spec = execPipeline<ISpec, SpecPipelineContext>(pipeline as VChartSpecPipeline, context)
    builder.spec = spec
    return spec
  } catch (e) {
    throw new Error(`buildSpecAsync error: ${(e as Error).message}`)
  } finally {
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now()
    builder.performance['buildSpecAsync'] = `${(end - start).toFixed(4)}ms`
  }
}
