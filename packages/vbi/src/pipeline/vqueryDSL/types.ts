import type { VQueryDSL } from '@visactor/vquery'
import type { VBIBuilderInterface, VBIDSL } from '../../types'

export type buildPipe = (
  queryDSL: VQueryDSL,
  context: { vbiDSL: VBIDSL; builder: VBIBuilderInterface<any, any> },
) => VQueryDSL
