import { buildVQuery as buildVQueryPipeline } from 'src/pipeline'
import type { VBIChartQueryBuilder } from 'src/types'
import type { DefaultVBIQueryDSL } from './types'

export const buildVQueryDSL: VBIChartQueryBuilder<DefaultVBIQueryDSL> = ({ vbiDSL, builder }) => {
  return buildVQueryPipeline(vbiDSL, builder)
}
