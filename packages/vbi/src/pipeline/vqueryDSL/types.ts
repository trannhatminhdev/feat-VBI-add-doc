import type { VQueryDSL } from '@visactor/vquery'
import type { VBIBuilderInterface, VBIDSL } from '../../types'

export type buildPipeContext = {
  vbiDSL: VBIDSL
  builder: VBIBuilderInterface<any, any>
}

export type buildPipe = (queryDSL: VQueryDSL, context: buildPipeContext) => VQueryDSL
