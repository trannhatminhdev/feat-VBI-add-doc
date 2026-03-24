import type { VBIChartBuilderAdapters } from 'src/types'
import { buildVQueryDSL } from './build-vquery'
import { buildVSeedDSL } from './build-vseed'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'

export type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'
export { buildVQueryDSL } from './build-vquery'
export { buildVSeedDSL } from './build-vseed'

export const defaultVBIChartBuilderAdapters: VBIChartBuilderAdapters<DefaultVBIQueryDSL, DefaultVBISeedDSL> = {
  buildVQuery: buildVQueryDSL,
  buildVSeed: buildVSeedDSL,
}

export const resolveVBIChartBuilderAdapters = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  adapters?: Partial<VBIChartBuilderAdapters<TQueryDSL, TSeedDSL>>,
): VBIChartBuilderAdapters<TQueryDSL, TSeedDSL> => {
  return {
    buildVQuery:
      adapters?.buildVQuery ??
      (defaultVBIChartBuilderAdapters.buildVQuery as unknown as VBIChartBuilderAdapters<
        TQueryDSL,
        TSeedDSL
      >['buildVQuery']),
    buildVSeed:
      adapters?.buildVSeed ??
      (defaultVBIChartBuilderAdapters.buildVSeed as unknown as VBIChartBuilderAdapters<
        TQueryDSL,
        TSeedDSL
      >['buildVSeed']),
  }
}
