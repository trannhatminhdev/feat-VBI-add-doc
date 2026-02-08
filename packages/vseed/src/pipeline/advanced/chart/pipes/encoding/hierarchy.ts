import { unique } from 'remeda'
import { MeasureId } from 'src/dataReshape'
import { hasMultipleMeasureInSingleView } from 'src/pipeline/utils'
import type { AdvancedPipe, Dimension, Dimensions, Encoding, Measure, Measures } from 'src/types'
import { addColorToEncoding } from './color'

export const defaultEncodingForHierarchy: AdvancedPipe = (advancedVSeed) => {
  const { measures = [], reshapeMeasures = [], dimensions = [] } = advancedVSeed
  const encoding: Encoding = {}
  generateDefaultDimensionEncoding(dimensions, encoding, hasMultipleMeasureInSingleView(reshapeMeasures))
  generateDefaultMeasureEncoding(measures, encoding)
  return { ...advancedVSeed, encoding }
}

export const encodingForHierarchy: AdvancedPipe = (advancedVSeed) => {
  const { measures = [], reshapeMeasures = [], dimensions = [] } = advancedVSeed

  const hasDimensionEncoding = dimensions.some((item: Dimension) => item.encoding)
  const hasMeasureEncoding = measures.some((item: Measure) => item.encoding)
  const encoding: Encoding = {}
  const hasMulti = hasMultipleMeasureInSingleView(reshapeMeasures)

  if (hasDimensionEncoding) {
    generateDimensionEncoding(dimensions, encoding, hasMulti)
  } else {
    generateDefaultDimensionEncoding(dimensions, encoding, hasMulti)
  }

  if (hasMeasureEncoding) {
    generateMeasureEncoding(measures, encoding)
  } else {
    generateDefaultMeasureEncoding(measures, encoding)
  }

  return { ...advancedVSeed, encoding }
}

/**
 * --------------------维度--------------------
 */
const generateDefaultDimensionEncoding = (dimensions: Dimensions, encoding: Encoding, isMultiMeasure: boolean) => {
  const uniqueDimIds = unique(dimensions.map((d) => d.id))

  // 默认所有维度都参与层级构建 (排除 MeasureId)
  encoding.hierarchy = uniqueDimIds.filter((d) => d !== MeasureId)

  // 默认颜色映射:
  // 1. 如果是多指标，通常 MeasureId 会作为颜色区分
  // 2. 如果是单指标，按照需求，将第一个维度映射到 color
  if (isMultiMeasure) {
    // 多指标场景，通常 MeasureId 就在 uniqueDimIds 中
    // 这里我们简单地取第一个维度作为 color，如果是多指标，MeasureId 可能会被放到 dimensions 中
    // 但为了稳健，如果 isMultiMeasure，我们倾向于让 MeasureId 参与颜色
    // 不过按照用户明确需求 "让第一个维度 encoding到color"
    encoding.color = uniqueDimIds.slice(0, 1)
  } else {
    // 单指标场景，取第一个维度
    // 排除 MeasureId 以防万一 (虽然单指标通常不含 MeasureId 维度，除非显式添加)
    const validDims = uniqueDimIds.filter((d) => d !== MeasureId)
    encoding.color = validDims.slice(0, 1)
  }

  // Detail 通常跟随 Hierarchy 或者 Color
  // 这里设为与 Hierarchy 一致，确保所有层级都被正确展开
  encoding.detail = encoding.hierarchy

  encoding.tooltip = uniqueDimIds.filter((d) => d !== MeasureId)
  encoding.label = []
  encoding.row = []
  encoding.column = []
}

const generateDimensionEncoding = (dimensions: Dimensions, encoding: Encoding, isMultiMeasure: boolean) => {
  // hierarchy
  encoding.hierarchy = unique(dimensions.filter((item) => item.encoding === 'hierarchy').map((item) => item.id))
  if (encoding.hierarchy.length === 0) {
    encoding.hierarchy = unique(dimensions.map((d) => d.id)).filter((d) => d !== MeasureId)
  }

  // color
  addColorToEncoding(dimensions, encoding, isMultiMeasure)

  // detail
  encoding.detail = unique(dimensions.filter((item) => item.encoding === 'detail').map((item) => item.id))
  if (encoding.detail.length === 0) {
    encoding.detail = encoding.hierarchy
  }

  // tooltip
  encoding.tooltip = unique(dimensions.map((item) => item.id))
  encoding.tooltip = encoding.tooltip.filter((d) => d !== MeasureId)

  // label
  encoding.label = unique(dimensions.filter((item) => item.encoding === 'label').map((item) => item.id))
  encoding.label = encoding.label.filter((d) => d !== MeasureId)
}

/**
 * --------------------指标--------------------
 */
const generateDefaultMeasureEncoding = (measures: Measures, encoding: Encoding) => {
  encoding.size = unique(measures.filter((item) => item.encoding === 'size' || !item.encoding).map((item) => item.id))
  // 但我们可以把它们放到 tooltip 中
  encoding.tooltip = unique([...(encoding.tooltip || []), ...measures.map((m) => m.id)])
}

const generateMeasureEncoding = (measures: Measures, encoding: Encoding) => {
  // size
  encoding.size = unique(measures.filter((item) => item.encoding === 'size' || !item.encoding).map((item) => item.id))

  // color
  const color = unique(measures.filter((item) => item.encoding === 'color').map((item) => item.id))
  if (color.length > 0) {
    encoding.color = color
  }

  // label
  const label = unique(measures.filter((item) => item.encoding === 'label').map((item) => item.id))
  encoding.label = unique([...(encoding.label || []), ...label])

  // tooltip
  const tooltip = unique(measures.filter((item) => item.encoding === 'tooltip').map((item) => item.id))
  encoding.tooltip = unique([...(encoding.tooltip || []), ...label, ...tooltip, ...color])
}
