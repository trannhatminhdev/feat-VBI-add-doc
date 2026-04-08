import type { VBIInsightDSL } from 'src/types'
import { id } from 'src/utils'

export const generateEmptyInsightDSL = (uuid: string = id.resourceUUID()): VBIInsightDSL => {
  return {
    uuid,
    content: '',
    version: 0,
  }
}
