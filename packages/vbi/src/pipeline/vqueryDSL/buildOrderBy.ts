import type { VQueryDSL } from '@visactor/vquery'
import { DimensionsBuilder, MeasuresBuilder } from '../../builder'
import type { buildPipe } from './types'

const toOrderItem = (node: { id: string; sort?: { order: 'asc' | 'desc' } }) => ({
  field: node.id,
  order: node.sort?.order,
})

export const buildOrderBy: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const dimensions = context.vbiDSL.dimensions.filter(DimensionsBuilder.isDimensionNode)
  const measures = context.vbiDSL.measures.filter(MeasuresBuilder.isMeasureNode)
  const sortedDimensions = dimensions.filter((node) => node.sort)
  const sortedMeasures = measures.filter((node) => node.sort)
  const sortedNodes = [...sortedDimensions, ...sortedMeasures]

  if (sortedNodes.length > 0) {
    result.orderBy = sortedNodes.map(toOrderItem)
    return result as VQueryDSL
  }

  const firstDimension = dimensions[0]
  if (firstDimension) {
    result.orderBy = [{ field: firstDimension.id, order: 'asc' }]
  }

  return result as VQueryDSL
}
