import type { VBIConnectorId } from 'src/types/connector/connector'
import type { VBIDSL } from 'src/types'

export const generateEmptyDSL = (connectorId: VBIConnectorId): VBIDSL => {
  return {
    connectorId,
    chartType: 'table',
    measures: [],
    dimensions: [],
    whereFilter: {
      id: 'root',
      op: 'and',
      conditions: [],
    },
    havingFilter: {
      id: 'root',
      op: 'and',
      conditions: [],
    },
    theme: 'light',
    locale: 'zh-CN',
    version: 0,
  }
}
