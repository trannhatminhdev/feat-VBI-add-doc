import * as Y from 'yjs'
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIBuilder } from '../vbi-builder'
import { buildVQuery as buildVQueryPipeline } from 'src/pipeline'
import { buildVBIDSL } from './build'

export const buildVQueryDSL = (dsl: Y.Map<any>, builder: VBIBuilder): VQueryDSL => {
  const vbiDSL = buildVBIDSL(dsl)
  return buildVQueryPipeline(vbiDSL, builder)
}
