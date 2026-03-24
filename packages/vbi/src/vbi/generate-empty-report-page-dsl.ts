import type { VBIConnectorId } from 'src/types/connector/connector'
import type { VBIReportPageDSL } from 'src/types'
import { id } from 'src/utils'
import { generateEmptyChartDSL } from './generate-empty-dsl'

export const generateEmptyReportPageDSL = (connectorId: VBIConnectorId = ''): VBIReportPageDSL => {
  return {
    id: id.uuid(),
    title: '',
    chart: generateEmptyChartDSL(connectorId),
    text: {
      content: '',
    },
  }
}
