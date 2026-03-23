import type { VBIConnectorId } from 'src/types/connector/connector'
import type { VBIChartDSL } from 'src/types'

export const generateEmptyChartDSL = (connectorId: VBIConnectorId): VBIChartDSL => {
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
