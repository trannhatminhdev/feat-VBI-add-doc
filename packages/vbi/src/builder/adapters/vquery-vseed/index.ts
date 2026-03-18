import type { VBIBuilderAdapters } from 'src/types'
import { buildVQueryDSL } from './build-vquery'
import { buildVSeedDSL } from './build-vseed'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'

export type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from './types'
export { buildVQueryDSL } from './build-vquery'
export { buildVSeedDSL } from './build-vseed'

export const defaultVBIBuilderAdapters: VBIBuilderAdapters<DefaultVBIQueryDSL, DefaultVBISeedDSL> = {
  buildVQuery: buildVQueryDSL,
  buildVSeed: buildVSeedDSL,
}

export const resolveVBIBuilderAdapters = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  adapters?: Partial<VBIBuilderAdapters<TQueryDSL, TSeedDSL>>,
): VBIBuilderAdapters<TQueryDSL, TSeedDSL> => {
  return {
    buildVQuery:
      adapters?.buildVQuery ??
      (defaultVBIBuilderAdapters.buildVQuery as unknown as VBIBuilderAdapters<TQueryDSL, TSeedDSL>['buildVQuery']),
    buildVSeed:
      adapters?.buildVSeed ??
      (defaultVBIBuilderAdapters.buildVSeed as unknown as VBIBuilderAdapters<TQueryDSL, TSeedDSL>['buildVSeed']),
  }
}
