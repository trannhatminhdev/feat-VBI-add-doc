import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import type { Map } from 'yjs'
import type { VBIChartDSL } from '../dsl'
import type { BuildVSeedOptions } from './build-vseed'
import type { VBIChartBuilderInterface } from './VBIInterface'

export interface VBIChartBuildVQueryContext<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  dsl: Map<any>
  vbiDSL: VBIChartDSL
  builder: VBIChartBuilderInterface<TQueryDSL, TSeedDSL>
}

export interface VBIChartBuildVSeedContext<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>
  extends VBIChartBuildVQueryContext<TQueryDSL, TSeedDSL> {
  options: BuildVSeedOptions
  queryDSL: TQueryDSL
}

export type VBIChartQueryBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> = (
  context: VBIChartBuildVQueryContext<TQueryDSL, TSeedDSL>,
) => TQueryDSL

export type VBIChartSeedBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> = (
  context: VBIChartBuildVSeedContext<TQueryDSL, TSeedDSL>,
) => Promise<TSeedDSL> | TSeedDSL

export interface VBIChartBuilderAdapters<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  buildVQuery: VBIChartQueryBuilder<TQueryDSL, TSeedDSL>
  buildVSeed: VBIChartSeedBuilder<TQueryDSL, TSeedDSL>
}

export interface VBIChartBuilderOptions<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  adapters?: Partial<VBIChartBuilderAdapters<TQueryDSL, TSeedDSL>>
}
