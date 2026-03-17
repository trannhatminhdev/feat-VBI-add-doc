import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'
import { MeasuresBuilder, DimensionsBuilder } from '../../builder'
import { mapAggregateForVQuery } from './aggregateMap'

export const buildSelect: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const measures = vbiDSL.measures
  const dimensions = vbiDSL.dimensions

  const result = { ...queryDSL }
  const measureNodes = measures.filter((measure) => MeasuresBuilder.isMeasureNode(measure))
  const measureSelects = measureNodes.map((measure) => ({
    field: measure.field,
    alias: measure.alias,
    aggr: mapAggregateForVQuery(measure.aggregate),
  }))

  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
  const dimensionSelects = dimensionNodes.map((dimension) => ({
    field: dimension.field,
    alias: dimension.alias,
  }))

  result.select = [...measureSelects, ...dimensionSelects] as any

  return result as VQueryDSL
}
