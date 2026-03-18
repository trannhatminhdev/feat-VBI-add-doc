import type { VBISeedBuilder } from 'src/types'
import { getConnector } from 'src/builder/connector'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'

export const buildVSeedDSL: VBISeedBuilder<DefaultVBIQueryDSL, DefaultVBISeedDSL> = async ({ vbiDSL, queryDSL }) => {
  const connectorId = vbiDSL.connectorId
  const connector = await getConnector(connectorId)
  const schema = await connector.discoverSchema()
  const queryResult = await connector.query({ queryDSL, schema, connectorId })

  return {
    chartType: vbiDSL.chartType,
    dataset: queryResult.dataset,
    theme: vbiDSL.theme,
    locale: vbiDSL.locale,
  } as DefaultVBISeedDSL
}
