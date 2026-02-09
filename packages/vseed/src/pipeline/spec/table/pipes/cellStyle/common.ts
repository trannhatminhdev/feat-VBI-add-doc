import { isArray } from 'remeda'
import { InnerRowIndex } from 'src/dataReshape'
import type { BodyCellStyle, Datum } from 'src/types'

const tableStyleMap = {
  backgroundColor: 'bgColor',
  textColor: 'color',
  textFontSize: 'fontSize',
  borderColor: 'borderColor',
  borderLineWidth: 'borderLineWidth',
}

export const pickBodyCellStyle = (bodyCellStyle: BodyCellStyle) => {
  return (Object.keys(tableStyleMap) as Array<keyof typeof tableStyleMap>).reduce<Record<string, any>>((acc, key) => {
    if (key in bodyCellStyle) {
      acc[tableStyleMap[key]] = bodyCellStyle[key]
    }

    return acc
  }, {})
}

export const getCellOriginalDataByDatum = (datum: any, hasDynamicFilter: boolean, originalDatum: Datum) => {
  const tableInstance = datum?.table
  let originRowData =
    tableInstance && hasDynamicFilter ? tableInstance?.getCellOriginRecord(datum?.col, datum?.row) : null
  if (originRowData && isArray(originRowData)) {
    originRowData = originRowData[0]
  }
  return originRowData
    ? {
        ...originalDatum,
        [InnerRowIndex]: originRowData?.[InnerRowIndex], // 内部行号字段
      }
    : null
}
