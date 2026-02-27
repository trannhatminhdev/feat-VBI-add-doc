import { intl } from 'src/i18n'
import { createFormatterByMeasure } from 'src/pipeline/utils'
import type { ListTableSpecPipe, Measure } from 'src/types'

/**
 * @description 为表格列添加汇总行配置
 * - 只对度量列应用聚合函数
 * - 在第一个维度列显示汇总标签
 * - 其他维度列留空
 */
export const columnsAggregation: ListTableSpecPipe = (spec, context) => {
  const { vseed, advancedVSeed } = context
  const { totalType } = vseed as any

  if (!totalType) {
    return spec
  }

  // 映射汇总类型到 i18n 标签
  const totalLabelMap: Record<string, string> = {
    sum: intl.i18n`合计`,
    avg: intl.i18n`平均`,
    max: intl.i18n`最大值`,
    min: intl.i18n`最小值`,
    count: intl.i18n`计数`,
  }

  const totalLabel = totalLabelMap[totalType] || intl.i18n`合计`

  // 映射到 VTable 的聚合类型
  const vtableAggregationMap: Record<string, string> = {
    sum: 'SUM',
    avg: 'AVG',
    max: 'MAX',
    min: 'MIN',
    count: 'COUNT',
  }

  const vtableAggregationType = vtableAggregationMap[totalType] || 'SUM'

  // 普通表格的 dimensionTree 和 measureTree 是扁平结构，直接取 id
  const dimensionIds = new Set((advancedVSeed.dimensionTree || []).map((d) => d.id))
  const measureTree = advancedVSeed.measureTree || []
  const measureIds = new Set(measureTree.map((m) => m.id))

  // 创建 measure id 到 measure 对象的映射
  const measureMap = new Map<string, Measure>()
  measureTree.forEach((measure) => {
    measureMap.set(measure.id, measure as Measure)
  })

  let isFirstDimensionColumn = true

  const updatedColumns = spec.columns?.map((column: any) => {
    const fieldKey = column.field

    // 维度列处理
    if (dimensionIds.has(fieldKey)) {
      if (isFirstDimensionColumn) {
        isFirstDimensionColumn = false
        return {
          ...column,
          aggregation: {
            aggregationType: 'NONE',
            formatFun: () => totalLabel,
          },
        }
      }

      // 其他维度列留空
      return {
        ...column,
        aggregation: {
          aggregationType: 'NONE',
          formatFun: () => '',
        },
      }
    }

    // 度量列处理 - 应用聚合函数和格式化
    if (measureIds.has(fieldKey)) {
      const measure = measureMap.get(fieldKey)
      const formatter = createFormatterByMeasure(measure)

      return {
        ...column,
        aggregation: {
          aggregationType: vtableAggregationType,
          showOnTop: false,
          formatFun: (value: number | string | undefined) => formatter(value),
        },
      }
    }

    return column
  })

  return {
    ...spec,
    columns: updatedColumns,
    bottomFrozenRowCount: 1,
  }
}
