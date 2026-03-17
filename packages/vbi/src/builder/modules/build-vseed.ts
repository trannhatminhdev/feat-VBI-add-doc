import type { VSeedDSL } from '@visactor/vseed'
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIDSL } from 'src/types'
import { getConnector } from '../connector'

export interface BuildVSeedInput {
  vbiDSL: VBIDSL
  queryDSL: VQueryDSL
}

export const buildVSeedDSL = async ({ vbiDSL, queryDSL }: BuildVSeedInput): Promise<VSeedDSL> => {
  const connectorId = vbiDSL.connectorId
  const connector = await getConnector(connectorId)
  const schema = await connector.discoverSchema()
  const queryResult = await connector.query({ queryDSL, schema, connectorId })

  return {
    chartType: vbiDSL.chartType,
    dataset: queryResult.dataset,
    theme: vbiDSL.theme,
    locale: vbiDSL.locale,
  } as VSeedDSL
}
