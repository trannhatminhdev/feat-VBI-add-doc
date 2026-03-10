import type { VQueryDSL } from '@visactor/vquery'
import type { VBIDSL } from '../../types'
import type { VBIBuilder } from '../../builder'

export type buildPipe = (queryDSL: VQueryDSL, context: { vbiDSL: VBIDSL; builder: VBIBuilder }) => VQueryDSL
