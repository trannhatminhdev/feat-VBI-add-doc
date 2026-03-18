import { buildVQuery as buildVQueryPipeline } from 'src/pipeline'
import type { VBIQueryBuilder } from 'src/types'
import type { DefaultVBIQueryDSL } from './types'

export const buildVQueryDSL: VBIQueryBuilder<DefaultVBIQueryDSL> = ({ vbiDSL, builder }) => {
  return buildVQueryPipeline(vbiDSL, builder)
}
