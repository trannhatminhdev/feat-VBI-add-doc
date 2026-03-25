import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { DimensionsBuilder } from '../../features'

export const buildGroupBy: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const { vbiDSL } = context
  const dimensions = vbiDSL.dimensions
  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))

  result.groupBy = dimensionNodes.map((dimension) => (dimension.aggregate ? dimension.id : dimension.field))
  return result as VQueryDSL
}
