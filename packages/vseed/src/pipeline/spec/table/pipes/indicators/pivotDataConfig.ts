import { intl } from 'src/i18n'
import { findAllMeasures } from 'src/pipeline/utils'
import type { Dimension, PivotTable, PivotTableSpecPipe } from 'src/types'

export const dataConfig: PivotTableSpecPipe = (spec, context) => {
  const { advancedVSeed, vseed } = context
  const measures = findAllMeasures(advancedVSeed.measureTree)

  const aggregationRules = measures.map((measure) => ({
    field: measure.id,
    aggregationType: 'SUM',
    indicatorKey: measure.id,
  }))

  const dataConfigObj: any = {
    aggregationRules,
  }

  // 处理totals配置
  const { totals } = vseed as PivotTable
  if (totals) {
    const grandTotalLabel = intl.i18n`总计`
    const subTotalLabel = intl.i18n`小计`

    dataConfigObj.totals = {}

    // 处理行配置
    if (totals.row) {
      const dimensionIds = (advancedVSeed.dimensionTree || [])
        .filter((dim: Dimension) => dim.encoding === 'row')
        .map((dim) => dim.id)
      const rowSubDimensions = totals.row.subTotalsDimensions?.filter((dim) => dimensionIds.includes(dim))
      const normalizedRowSubDimensions =
        totals.row.showSubTotals && (!rowSubDimensions || rowSubDimensions.length === 0)
          ? dimensionIds.length > 0
            ? [dimensionIds[0]]
            : []
          : rowSubDimensions

      dataConfigObj.totals.row = {
        showGrandTotals: totals.row.showGrandTotals ?? false,
        showSubTotals: totals.row.showSubTotals ?? false,
        subTotalsDimensions: normalizedRowSubDimensions,
        grandTotalLabel,
        subTotalLabel,
      }
    }

    // 处理列配置
    if (totals.column) {
      const dimensionIds = (advancedVSeed.dimensionTree || [])
        .filter((dim: Dimension) => dim.encoding === 'column')
        .map((dim) => dim.id)
      const columnSubDimensions = totals.column.subTotalsDimensions?.filter((dim) => dimensionIds.includes(dim))
      const normalizedColumnSubDimensions =
        totals.column.showSubTotals && (!columnSubDimensions || columnSubDimensions.length === 0)
          ? dimensionIds.length > 0
            ? [dimensionIds[0]]
            : []
          : columnSubDimensions

      dataConfigObj.totals.column = {
        showGrandTotals: totals.column.showGrandTotals ?? false,
        showSubTotals: totals.column.showSubTotals ?? false,
        subTotalsDimensions: normalizedColumnSubDimensions,
        grandTotalLabel,
        subTotalLabel,
      }
    }
  }

  return {
    ...spec,
    dataConfig: dataConfigObj,
  }
}
