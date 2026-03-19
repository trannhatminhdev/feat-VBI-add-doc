import type { Dimension, Measure } from '@visactor/vseed'
import { DimensionsBuilder, MeasuresBuilder } from 'src/builder/features'
import type { VBISeedBuilder } from 'src/types'
import { getConnector } from 'src/builder/connector'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'

export const buildVSeedDSL: VBISeedBuilder<DefaultVBIQueryDSL, DefaultVBISeedDSL> = async ({ vbiDSL, queryDSL }) => {
  const connectorId = vbiDSL.connectorId
  const connector = await getConnector(connectorId)
  const schema = await connector.discoverSchema()
  const queryResult = await connector.query({ queryDSL, schema, connectorId })
  const measures = vbiDSL.measures
    .filter((measure) => MeasuresBuilder.isMeasureNode(measure))
    .map<Measure>((measure) => ({
      id: measure.id,
      alias: measure.alias,
    }))
  const dimensions = vbiDSL.dimensions
    .filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
    .map<Dimension>((dimension) => {
      const nextDimension: Dimension = {
        id: dimension.id,
        alias: dimension.alias,
      }

      if (dimension.encoding) {
        nextDimension.encoding = dimension.encoding
      }

      return nextDimension
    })

  return {
    chartType: vbiDSL.chartType,
    dataset: queryResult.dataset,
    dimensions,
    measures,
    theme: vbiDSL.theme,
    locale: vbiDSL.locale,
  } as DefaultVBISeedDSL
}
