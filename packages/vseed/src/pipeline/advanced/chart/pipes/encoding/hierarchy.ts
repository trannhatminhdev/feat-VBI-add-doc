import { unique } from 'remeda'
import { MeasureId } from 'src/dataReshape'
import { hasMultipleMeasureInSingleView } from 'src/pipeline/utils'
import type { AdvancedPipe, Dimension, Dimensions, Encoding, Measure, Measures } from 'src/types'

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
  if (!isMultiMeasure) {
    encoding.hierarchy = uniqueDimIds.filter((d) => d !== MeasureId)
  } else {
    encoding.hierarchy = uniqueDimIds
  }

  encoding.detail = encoding.hierarchy

  encoding.tooltip = uniqueDimIds.filter((d) => d !== MeasureId)
  encoding.label = []
  encoding.row = []
  encoding.column = []
}

const generateDimensionEncoding = (dimensions: Dimensions, encoding: Encoding, isMultiMeasure: boolean) => {
  // hierarchy
  encoding.hierarchy = unique(dimensions.filter((item) => item.encoding === 'hierarchy').map((item) => item.id))
  if (isMultiMeasure && !encoding.hierarchy.includes(MeasureId)) {
    encoding.hierarchy.push(MeasureId)
  }

  // color
  encoding.color = encoding.hierarchy.slice(0, 1)

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
