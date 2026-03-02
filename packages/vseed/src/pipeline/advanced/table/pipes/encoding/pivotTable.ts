import { unique } from 'remeda'
import { MeasureId, MeasureName } from 'src/dataReshape'
import { findAllMeasures } from 'src/pipeline/utils'
import type { AdvancedPipe, Dimension, Dimensions, Encoding, Measure, Measures } from 'src/types'

export const encodingForPivotTable: AdvancedPipe = (advancedVSeed) => {
  const { measureTree = [], dimensionTree = [] } = advancedVSeed
  const measures = findAllMeasures(measureTree)

  // 过滤掉用户输入中可能存在的虚拟指标维度（__MeaId__ / __MeaName__），
  // pivotTable 不再做 data reshape，这些虚拟维度不再需要
  const filteredDimensionTree = dimensionTree.filter((dim: Dimension) => dim.id !== MeasureId && dim.id !== MeasureName)

  const hasDimensionEncoding = filteredDimensionTree.some((item: Dimension) => item.encoding)
  const hasMeasureEncoding = measures.some((item: Measure) => item.encoding)
  const encoding: Encoding = {}

  if (hasDimensionEncoding) {
    generateDimensionEncoding(filteredDimensionTree, encoding)
  } else {
    generateDefaultDimensionEncoding(filteredDimensionTree, encoding)
  }

  if (hasMeasureEncoding) {
    generateMeasureEncoding(measures, encoding)
  } else {
    generateDefaultMeasureEncoding(measures, encoding)
  }

  return { ...advancedVSeed, dimensionTree: filteredDimensionTree, encoding }
}

/**
 * --------------------维度--------------------
 */
const generateDefaultDimensionEncoding = (dimensions: Dimensions, encoding: Encoding) => {
  const uniqueDimIds = unique(dimensions.map((d) => d.id))
  encoding.tooltip = uniqueDimIds
  encoding.row = []
  encoding.column = []

  uniqueDimIds.forEach((item, index) => {
    if (index % 2 === 0) {
      encoding.column!.push(item)
    } else {
      encoding.row!.push(item)
    }
  })
}
const generateDimensionEncoding = (dimensions: Dimensions, encoding: Encoding) => {
  const uniqueDimIds = unique(dimensions.map((d) => d.id))
  encoding.tooltip = uniqueDimIds
  encoding.row = []
  encoding.column = []

  dimensions.forEach((dim, index) => {
    const id = dim.id
    if (dim.encoding === 'row') {
      encoding.row!.push(id)
    } else if (dim.encoding === 'column') {
      encoding.column!.push(id)
    } else {
      if (index % 2 === 0) {
        encoding.column!.push(id)
      } else {
        encoding.row!.push(id)
      }
    }
  })
}

/**
 * --------------------指标--------------------
 */
const generateDefaultMeasureEncoding = (measures: Measures, encoding: Encoding) => {
  encoding.tooltip = unique(measures.map((item) => item.id))
  encoding.detail = unique(
    measures.filter((item) => item.encoding === 'detail' || !item.encoding).map((item) => item.id),
  )
}
const generateMeasureEncoding = (measures: Measures, encoding: Encoding) => {
  encoding.tooltip = measures.map((item) => item.id)
  encoding.detail = unique(
    measures.filter((item) => item.encoding === 'detail' || !item.encoding).map((item) => item.id),
  )
}
