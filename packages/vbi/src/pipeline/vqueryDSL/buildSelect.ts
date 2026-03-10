import type { Select, VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { MeasuresBuilder, DimensionsBuilder } from '../../builder'

export const buildSelect: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const measures = vbiDSL.measures
  const dimensions = vbiDSL.dimensions

  const result = { ...queryDSL }
  const measureNodes = measures.filter((measure) => MeasuresBuilder.isMeasureNode(measure))
  const measureSelects: Select<Record<string, unknown>> = measureNodes.map((measure) => ({
    field: measure.field,
    alias: measure.alias,
    aggr: measure.aggregate,
  }))

  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
  const dimensionSelects: Select<Record<string, unknown>> = dimensionNodes.map((dimension) => ({
    field: dimension.field,
    alias: dimension.alias,
  }))

  result.select = measureSelects.concat(dimensionSelects)

  return result as VQueryDSL
}
