import type { VQueryDSL } from '@visactor/vquery'
import type { VBIChartBuilderInterface, VBIChartDSL } from '../../types'

export type buildPipeContext = {
  vbiDSL: VBIChartDSL
  builder: VBIChartBuilderInterface<any, any>
}

export type buildPipe = (queryDSL: VQueryDSL, context: buildPipeContext) => VQueryDSL
