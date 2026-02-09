import type { IIndicator, PivotTableConstructorOptions } from '@visactor/vtable'
import { array } from '@visactor/vutils'
import { isNullish, isString } from 'remeda'
import { selector, selectorWithDynamicFilter } from 'src/dataSelector/selector'
import type { BodyCellStyle, Datum, PivotTableSpecPipe } from 'src/types'
import { getCellOriginalDataByDatum, pickBodyCellStyle } from './common'
import { FoldMeasureValue, MeasureId } from 'src/dataReshape'

export const pivotTableBodyCell: PivotTableSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { cellStyle } = advancedVSeed
  const bodyCellStyle = cellStyle?.bodyCellStyle

  if (!bodyCellStyle) {
    return spec as PivotTableConstructorOptions
  }
  const bodyCellStyleList = array(bodyCellStyle) as BodyCellStyle[]
  const indicators = (spec as PivotTableConstructorOptions).indicators || []
  const selectedPos: { col: number; row: number }[] = []
  const hasDynamicFilter = bodyCellStyleList.some((style) => !!style.dynamicFilter)

  const newIndicators = indicators.map((ind) => {
    const newInd = isString(ind)
      ? ({
          indicatorKey: ind,
        } as IIndicator)
      : ind

    const { indicatorKey } = newInd

    newInd.style = (datum: any) => {
      const { dataValue, cellHeaderPaths } = datum
      const headerPaths = [...cellHeaderPaths.colHeaderPaths, ...cellHeaderPaths.rowHeaderPaths]

      const originalDatum: Datum = {
        [indicatorKey]: dataValue,
      }

      headerPaths.forEach((path: any) => {
        if (path.dimensionKey) {
          originalDatum[path.dimensionKey] = path.value
        }
      })

      if (!isNullish(originalDatum[MeasureId]) && !isNullish(originalDatum[FoldMeasureValue])) {
        originalDatum[originalDatum[MeasureId]] = originalDatum[FoldMeasureValue]
      }
      const currentCellData = getCellOriginalDataByDatum(datum, hasDynamicFilter, originalDatum)

      const mergedStyle = bodyCellStyleList.reduce<Record<string, any>>((result, style) => {
        const shouldApply = style.dynamicFilter
          ? selectorWithDynamicFilter(currentCellData || originalDatum, style.dynamicFilter)
          : selector(originalDatum, style.selector)
        if (shouldApply) {
          if (selectedPos.length && selectedPos[0].col === datum?.col && selectedPos[0].row === datum?.row) {
            // 说明重复进入了，清空历史
            selectedPos.length = 0
          }
          selectedPos.push({
            col: datum?.col,
            row: datum?.row,
          })
          return {
            ...result,
            ...pickBodyCellStyle(style),
          }
        }

        return result
      }, {})

      return mergedStyle
    }
    return newInd
  })
  return {
    ...spec,
    runningConfig: {
      ...((spec as any)?.runningConfig || {}),
      selectedPos,
    },
    indicators: newIndicators,
  } as PivotTableConstructorOptions
}
