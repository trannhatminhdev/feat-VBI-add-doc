import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import type { Map } from 'yjs'
import type { VBIDSL } from '../dsl'
import type { VBIBuilderInterface } from './VBIInterface'

export interface VBIBuildVQueryContext<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  dsl: Map<any>
  vbiDSL: VBIDSL
  builder: VBIBuilderInterface<TQueryDSL, TSeedDSL>
}

export interface VBIBuildVSeedContext<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>
  extends VBIBuildVQueryContext<TQueryDSL, TSeedDSL> {
  queryDSL: TQueryDSL
}

export type VBIQueryBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> = (
  context: VBIBuildVQueryContext<TQueryDSL, TSeedDSL>,
) => TQueryDSL

export type VBISeedBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> = (
  context: VBIBuildVSeedContext<TQueryDSL, TSeedDSL>,
) => Promise<TSeedDSL> | TSeedDSL

export interface VBIBuilderAdapters<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  buildVQuery: VBIQueryBuilder<TQueryDSL, TSeedDSL>
  buildVSeed: VBISeedBuilder<TQueryDSL, TSeedDSL>
}

export interface VBIBuilderOptions<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  adapters?: Partial<VBIBuilderAdapters<TQueryDSL, TSeedDSL>>
}
